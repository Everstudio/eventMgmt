import { Queue, Worker } from "bullmq";
import pool from "../configs/db.mjs";
import puppeteer from "puppeteer";
import qrcode from "qrcode";
import RegistrationsModel from "../models/registrationsModel.mjs";
import TicketsModel from "../models/ticketsModel.mjs";
import EventsModel from "../models/eventsModel.mjs";
import NotificationDelivery from "./notificationDelivery.mjs";

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.TOKEN;
const memberURL = process.env.MEMBER_URL;
const chipURL = process.env.CHIP_URL;
const chipKey = process.env.CHIP_KEY;

//define redis connection
const redisConnection = {
  host: "127.0.0.1",
  port: 6379,
};

let instance = null;

class BullUtils {
  constructor() {
    if (!instance) {
      this.queue = new Queue("jobQueue", { connection: redisConnection });
      this.pool = pool;
      this.batchSize = 500;
      this.registrationsModel = new RegistrationsModel();
      this.ticketsModel = new TicketsModel();
      this.eventsModel = new EventsModel();
      this.notificationDelivery = new NotificationDelivery();
      //start worker
      this.processJob();
      instance = this;
    }

    return instance;
  }

  async addJob(data) {
    await this.queue.add("jobTask", data, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10000,
      },
      delay: 5000, //for testing
    });
  }

  async processJob() {
    const worker = new Worker(
      "jobQueue",
      async (job) => {
        console.log(`Processing job ${job.id}`);
        const registrationId = job.data; // get registration id from job data

        //get registration by id
        const registrationData = await this.registrationsModel.getRegistrationById(parseInt(registrationId));
        console.log("registrationData", registrationData);

        const user_id = parseInt(registrationData.user_id);
        const event_id = parseInt(registrationData.event_id);
        const ticket_info = JSON.parse(registrationData.items);
        const registrationQR = await qrcode.toDataURL(registrationData.qr_code);

        let items = [];
        for (let i = 0; i < ticket_info.length; i++) {
          const ticketData = await this.ticketsModel.getTicketById(ticket_info[i].ticket_id);
          items.push({
            name: ticketData.name,
            quantity: ticket_info[i].quantity,
            price: ticketData.price,
            total: ticket_info[i].quantity * ticketData.price,
          });
        }

        console.log("items", items);

        //get event name
        const eventData = await this.eventsModel.getEventById(event_id);
        console.log("eventData", eventData);
        const eventName = eventData.name;

        //initial get request to member URL, to get the user data
        const memberData = await axios.get(`${memberURL}/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("memberData", memberData.data);
        const user = memberData.data;
        const userData = {
          name: user.displayName,
          addressLine1: user.addressLine1,
          addressLine2: user.addressLine2 === null ? "" : user.addressLine2,
          city: user.city,
          state: user.state,
          postcode: user.postcode,
          country: user.country,
          phone: user.phone,
          email: user.email,
        };

        const purchaseData = await axios.get(`${chipURL}/purchases/${registrationData.purchase_id}/`, {
          headers: {
            Authorization: `Bearer ${chipKey}`,
          },
        });
        
        const transaction_data = purchaseData.data.transaction_data;
       
        let paymentMethodData;
        if (transaction_data.extra.card_type == "debit" || transaction_data.extra.card_type == "credit") {
          paymentMethodData = "Credit / Debit Card";
        } else if (transaction_data.payment_method == "fpx") {
          paymentMethodData = "FPX";
        } else if (transaction_data.payment_method == "ewallet") {
          paymentMethodData = "E-Wallet";
        } else {
          paymentMethodData = "Online Payment";
        }

        const paymentDetails = {
          method: paymentMethodData,
          card: transaction_data.extra.masked_pan === null ? "" : transaction_data.extra.masked_pan,
        };

        const invoiceDate = new Date().toLocaleDateString("en-MY", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const browser = await puppeteer.launch({ headless: "new" });
        console.log("browser", browser);
        const page = await browser.newPage();

        const pdfHtml = `
<html>
  <head>
    <link rel='stylesheet' href='https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'>
    <style>
      body {
        /* margin-top: 20px; */
        background: #fff;
      }
      .container{
        width: 100%;
      }
      .panel{
        border: 0;
      }

      /*Invoice*/
      .invoice .top-left {
        font-size: 65px;
        color: #3ba0ff;
      }

      .invoice .top-right {
        text-align: right;
        padding-right: 20px;
      }

      .invoice .table-row {
        margin-left: -15px;
        margin-right: -15px;
        margin-top: 25px;
      }

      .invoice .payment-info {
        font-weight: 500;
      }

      .invoice .table-row .table > thead {
        border-top: 1px solid #ddd;
      }

      .invoice .table-row .table > thead > tr > th {
        border-bottom: none;
      }

      .invoice .table > tbody > tr > td {
        padding: 8px 20px;
      }

      .invoice .invoice-total {
        margin-right: -10px;
        font-size: 16px;
      }

      .invoice .last-row {
        border-bottom: 1px solid #ddd;
      }
      .itembody{
        border-bottom: 1px solid #ddd;
      }


      .ribbon-inner {
        text-align: center;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        position: relative;
        padding: 7px 0;
        left: -5px;
        top: 11px;
        width: 120px;
        background-color: #66c591;
        font-size: 15px;
        color: #fff;
      }

      .ribbon-inner:before,
      .ribbon-inner:after {
        content: "";
        position: absolute;
      }

      .ribbon-inner:before {
        left: 0;
      }

      .ribbon-inner:after {
        right: 0;
      }
    </style>
  </head>
  <body>
    <div class="container bootstrap snippets bootdeys">
      <div class="row">
        <div class="col-sm-12">
          <div class="panel panel-default invoice" id="invoice">
            <div class="panel-body">
         
              <div class="row">
                <div class="col-sm-6 top-left">
                  <h3>Event Management</h3>
                </div>

                <div class="col-sm-6 top-right">
                  <h3 class="marginright">INVOICE - ${registrationData.id}</h3>
                  <span class="marginright">
                    ${invoiceDate}
                  </span>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-xs-4 from">
                    <p class="lead marginbottom">${userData.name}</p>
                    <p>
                      ${userData.addressLine1}
                    </p>
                    <p>
                      ${userData.addressLine2}
                    </p>
                    <p>
                      ${userData.city}, ${userData.state}, ${userData.postcode}
                    </p>
                    <p>${userData.country}</p>
                    <p>Phone: ${userData.phone}</p>
                    <p>Email: ${userData.email}</p>
                </div>

                <div class="col-xs-4 to">
                  
                </div>

                <div class="col-xs-4 text-right payment-details">
                  <p class="lead marginbottom payment-info">Payment details</p>
                  <p>${paymentDetails.method}</p>
                  <p>
                    ${paymentDetails.card}
                  </p>
                </div>
              </div>

              <div class="row table-row">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 5%">#</th>
                      <th style="width: 50%">Item</th>
                      <th class="text-right" style="width: 15%">Quantity</th>
                      <th class="text-right" style="width: 15%">Unit Price (RM)</th>
                      <th class="text-right" style="width: 15%">Total Price (RM)</th>
                    </tr>
                  </thead>
                  <tbody class="itembody">
                  <tr>
                    <td></td>
                    <td>${eventName}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                    ${items.map((item, index) => {
                      return `
                      <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>${item.name}</td>
                        <td class="text-right text-right">${item.quantity}</td>
                        <td class="text-right text-right">${item.price}</td>
                        <td class="text-right text-right">${item.total}</td>
                      </tr>`;
                    })}
                  </tbody>
                </table>
              </div>

              <div class="row">
                <div class="col-xs-6 margintop">
                 
                </div>
                <div class="col-xs-6 text-right pull-right invoice-total">
                  <p>Subtotal : RM ${registrationData.sub_total}</p>
                  <p>Tax : RM ${registrationData.tax}</p>
                  <p>Discount : RM ${registrationData.discount}</p>
                  <p>Total : RM ${registrationData.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  <footer></footer>
</html>
        
        
          `;

        await page.setContent(pdfHtml);
        const pathData = path.join(__dirname, "../../document/invoice/invoice#" + registrationId + ".pdf");
        await page.pdf({
          //save pdf to file, ../../public/pdf/test.pdf
          path: pathData,
          format: "A4",
        });

        await browser.close();

        //send email
        const notificationData = {
          title: "Invoice",
          emailTo: userData.email,
          path: pathData,
        };
        await this.notificationDelivery.sendEmailNotification(notificationData);

        return true;
      },
      {
        connection: redisConnection,
      }
    );

    worker.on("completed", (job, returnvalue) => {
      console.log(`Job completed with result ${returnvalue}`);
    });

    worker.on("failed", (job, err) => {
      console.log(`Job failed with ${err.message}`);
    });
  }
}

export default BullUtils;
