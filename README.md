# 🐼 ProgramPanda

**ProgramPanda** is a versatile platform that allows users, creators, and admins to manage diet and workout programs seamlessly. The project integrates a powerful tech stack with a sleek and responsive UI, providing functionality for creating, purchasing, and managing fitness programs. Built with a user-centric design, ProgramPanda caters to creators who can sell their custom programs, users who can buy and download them, and admins who can oversee the entire platform.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Roles](#roles)
  - [User](#user)
  - [Creator](#creator)
  - [Admin](#admin)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## ✨ Features

- **Three Panel Role System**:
  - **User**: Purchase programs, download PDFs, and receive email invoices.
  - **Creator**: Create and sell fitness programs, customize PDF designs, and track earnings.
  - **Admin**: Manage users, programs, and send emails for promotional campaigns.
  
- **Program Types**:
  - Diet Plan
  - Workout Plan
  - Both
  
- **Earnings Distribution**: Creators earn **77%** of the total sale price, with **23%** going to ProgramPanda.
  
- **Stripe Integration**: Secure payment system for program purchases.
  
- **PDF Generation**: Automatically generate and download customized PDF programs with the ProgramPanda logo, creator name, and personalized color schemes.
  
- **Email Integration**: Automatically send email invoices after a successful purchase using Mailtrap.
  
- **Admin Control**: Admins can delete programs, manage users, and send targeted emails to users or creators.

## 🛠 Tech Stack

- **Frontend**: 
  - React.js
  - Tailwind CSS
  - React PDF (for PDF downloads)
  - Stripe (for payment processing)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (for database management)
  
- **Cloud Services**:
  - Cloudinary (for cloud data storage)
  - Mailtrap (for handling email communication)

- **Deployment**:
  - Render (for seamless backend and frontend deployment)




User
Browse and purchase programs via Stripe.
Receive email confirmation and invoice after each purchase.
Download the purchased program in a PDF format with full customization.
Creator
Register and connect your account to Stripe.
Create different types of programs (diet, workout, or both).
Set the price for the program and receive 77% of the total earnings.
Customize the PDF with color, size, and logo of ProgramPanda.
Track your program sales and earnings.
Admin
Manage all user and creator accounts.
Delete inappropriate or inactive programs.
Send targeted promotional emails to creators or users (or both).
🌐 Deployment
ProgramPanda is fully deployed on Render, providing a fast and scalable platform with excellent loading times. It ensures a seamless user experience for all panels.

🌐 Deployment
ProgramPanda is fully deployed at www.programpanda.co, providing a fast and scalable platform with excellent loading times. It ensures a seamless user experience for all panels.

