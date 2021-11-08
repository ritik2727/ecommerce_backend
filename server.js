const cors = require("cors");
const express = require("express");

const stripe = require("stripe")("sk_test_51JOzfFSGs3WteDI2DyEXTguNGO48WT16S1ISslSUOxUvQHa1qnQcyy128TGqxKnb27T0nVmtIVsoOrqrBVePZGxe00EzYiKHSh");
const { v4: uuidv4 } = require('uuid');
// uuidv4();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
   res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});

app.post("/checkout", async (req, res) => {
   console.log("Request:", req.body);

   let error;
   let status;
   try {
      const { token, amount, address } = req.body;
      myObj = {
         address: address
      }
      const customer = await stripe.customers.create({
         email: token.email,
         source: token.id
      });
      console.log(token.id)

      const idempotencyKey = uuidv4();
      const charge = await stripe.charges.create(
         {
            amount: amount * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: "purchased clothes",
            shipping: {
               name: token.card.name,
               address: {
                  country: "India",
                  line1: myObj.address[0].address,
                  city: myObj.address[0].city,
                  postal_code: myObj.address[0].pincode
               }
            }

         },
         {
            idempotencyKey
         }
      );
      console.log("Charge:", { charge });
      status = "success";
   } catch (error) {
      console.error("Error:", error);
      status = "failure";
   }

   res.json({ error, status });
});

app.listen(process.env.PORT || 5000)
console.log("Server Running")