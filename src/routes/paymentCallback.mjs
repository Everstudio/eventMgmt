import { Router } from "express";
import RegistrationsController from "../controllers/registrationsController.mjs";

const router = Router();

router.post("/payment/success", async (req, res) => {
  const events = await RegistrationsController.confirmRegistration(req, res);
});

router.post("/payment/fail", async (req, res) => {
  const events = await RegistrationsController.failRegistration(req, res);
});

router.post("/payment/webhook", async (req, res) => {
  console.log("Webhook received");
  console.log(req.body);
  //update purchase id,
  const purchase_id = req.body.id;
  const status = req.body.status;
  const type = req.body.type;

  if (type == "purchase") {
    if (status == "created") {
      const registration = await RegistrationsController.updateRegistrationPaymentId(req, res);
    } else if (status == "paid") {
      const registration = await RegistrationsController.confirmRegistration(req, res);
    } else if (status == "failed" || status == "error") {
      const registration = await RegistrationsController.failRegistration(req, res);
    }else{
      const registration = await RegistrationsController.failRegistration(req, res);
    }
  }
});

export default router;
