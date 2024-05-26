import { comparepassword, hashpassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    if (!name) {
      return res.status.send({
        message: "Name is Required",
      });
    }
    if (!email) {
      return res.status.send({
        message: " Email is Required",
      });
    }
    if (!password) {
      return res.status.send({
        message: "Password is Required",
      });
    }
    if (!phone) {
      return res.status.send({
        message: "Phone no is Required",
      });
    }
    if (!address) {
      return res.status.send({
        message: "Address is Required",
      });
    }
    //check if user already exist
    const exixtingUser = await userModel.findOne({ email });
    //exixting user
    if (exixtingUser) {
      return res.status(400).send({
        success: false,
        message: "Already Registered Please Login",
      });
    }
    //register user
    // jo password authhelper me get kr rhay hain yahn pass krwa rahy hain
    const hashedpassword = await hashpassword(password); //password will be hashed
    //save

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedpassword,
    }).save();
    res.status(200).send({
      success: true,
      message: "Registered Successfully",
      user: user,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};
//Post Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email or Password is Required",
      });
    }
    //check if user already exist
    const user = await userModel.findOne({ email });
    //exixting user
    if (!user) {
      //return ni kren gy to code further execute hota rahy ga
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    //jo password authhelper me get kr rhay hain yahn pass krwa rahy hain
    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //creating token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: password,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
// test controller
export const testController = (req, res) => {
  res.send("protected Route");
  // console.log("hello");
};

//updateProfileController

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 8) {
      return res.json({ error: "Password sould be  8 character long" });
    }
    const hashedPassword = password ? await hashpassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "profile updated succesfully",
      updatedUser,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in updating profile",
      error,
    });
  }
};

//getOrderController
export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in geting order controller",
      error,
    });
  }
};

//getAllOrderController
export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in geting order controller",
      error,
    });
  }
};

//orderStatusUpdateController
export const orderStatusUpdateController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.send("Error In Order Status Update Controller");
    error;
  }
};

//send contact email

export const contactEmailController = async (req, res) => {
  const { name, email, message } = req.body;
  // console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "FashionsFlick Contact Us",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us Message</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333; text-align: center;">Message From Contact Us Form</h1>
        <h5 style="color: #555; margin-top: 20px;">Name:</h5>
        <p style="color: #666; line-height: 1.6;">${name}</p>
        <h5 style="color: #555; margin-top: 20px;">Email:</h5>
        <p style="color: #666; line-height: 1.6;">${email}</p>
        <h5 style="color: #555; margin-top: 20px;">Message:</h5>
        <p style="color: #666; line-height: 1.6;">${message}</p>
    </div>
</body>
</html>
`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
      } else {
        // console.log("Email Sent Suucesfully" + info.response);
        res.status(200).send({
          success: true,
          message: "Email Sent Suucesfully",
        });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      suucess: false,
      message: "error in email controller",
      error,
    });
  }
};
export const sendOtpController = async (req, res) => {
  const { email, otp } = req.body; // Updated destructuring to get email and otp
  // console.log(otp);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "FashionsFlick Reset Password Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif;">

    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <h2 style="text-align: center; color: #007bff;">OTP for Password Reset</h2>
        <p>Hello,</p>
        <p>Your OTP (One-Time Password) for resetting your password is: <strong>${otp}</strong>.</p>
        <p>Please use this OTP to reset your password within the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
        <p>Thank you!</p>
        <p style="text-align: center; color: #888;">This email was generated automatically. Please do not reply.</p>
    </div>

</body>
</html>
`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
        res.status(500).send({
          success: false,
          message: "Error sending email",
          error: error,
        });
      } else {
        // console.log("Email Sent Successfully" + info.response);
        res.status(200).send({
          success: true,
          message: "Email Sent Successfully",
        });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in email controller",
      error: error,
    });
  }
};

export const subscribeEmailController = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "FashionsFlick.store",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FashionsFlick.store</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="text-align: center;">
                <h1 style="color: #333333; text-align: center;">Welcome to FashionsFlick.store!</h1>
                <p style="font-size: 18px; color: #555555; text-align: justify;">Hi,</p>
                <p style="font-size: 16px; color: #555555; text-align: justify;">Thank you for subscribing to our newsletter. We're excited to have you on board and can't wait to share our latest news, exclusive offers, and valuable insights with you.</p>
                
                <h2 style="color: #333333; text-align: center;">Here's what you can expect from our newsletters:</h2>
                <ul style="list-style-type: none; padding: 0; color: #555555; font-size: 16px; text-align: justify;">
                    <li style="margin-bottom: 10px;">• <strong>Latest Updates:</strong> Stay informed about our newest products, services, and innovations.</li>
                    <li style="margin-bottom: 10px;">• <strong>Exclusive Offers:</strong> Be the first to know about special promotions, discounts, and events.</li>
                    <li style="margin-bottom: 10px;">• <strong>Expert Insights:</strong> Get valuable tips, industry news, and expert advice directly to your inbox.</li>
                </ul>  
                <p style="font-size: 16px; color: #555555; text-align: justify;">If you have any questions or feedback, feel free to reach out to us at <a href="mailto:fashions.flick.store@gmail.com" style="color: #007bff;">fashions.flick.store@gmail.com</a>. We're here to help!</p>
                
                <p style="font-size: 16px; color: #555555; text-align: justify;">Thank you again for joining us. We look forward to connecting with you.</p>
                
                <p style="font-size: 16px; color: #555555; text-align: justify;">Best regards,<br>
                Tamoor Hassan<br>
                Owner<br>
                FashionsFlick<br>
                Contact Us: <a href="mailto:fashions.flick.store@gmail.com" style="color: #007bff;">fashions.flick.store@gmail.com</a><br>
                <a href="https://fashionsflick.com" style="color: #007bff;">fashionsflick.com</a></p>
            </td>
        </tr>
    </table>
</body>
</html>


`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
      } else {
        // console.log("Email Sent Suucesfully" + info.response);
        res.status(200).send({
          success: true,
          message: "Email Sent Suucesfully",
        });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      suucess: false,
      message: "error in email controller",
      error,
    });
  }
};




export const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the newPassword is provided in the request body
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required." });
    }

    // Hash the new password
    const hashedPassword = await hashpassword(newPassword);

    // Find the user by email in the database
    const user = await userModel.findOne({ email });

    if (!user) {
      // User not found
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update the user's password with the hashed password
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    // console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
