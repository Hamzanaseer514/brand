import nodemailer from 'nodemailer';

// Create transporter (configure based on your email provider)
const createTransporter = () => {
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.ADMIN_EMAIL,
      pass: process.env.SMTP_PASSWORD || process.env.ADMIN_PASSWORD,
    },
  });
};

// Generate invoice HTML
const generateInvoiceHTML = (order) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shippingAddress = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .invoice-container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #d4af37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1a1a1a;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .order-info div {
          flex: 1;
        }
        .order-info h3 {
          margin-top: 0;
          color: #1a1a1a;
          font-size: 14px;
          text-transform: uppercase;
        }
        .order-info p {
          margin: 5px 0;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #1a1a1a;
          color: #d4af37;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .text-right {
          text-align: right;
        }
        .total-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 16px;
        }
        .total-final {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #d4af37;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .status {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>A & N</h1>
          <p>Luxury Fragrances</p>
          <p>Invoice #${order.id}</p>
        </div>

        <div class="order-info">
          <div>
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status status-pending">${order.status}</span></p>
          </div>
          <div>
            <h3>Shipping Address</h3>
            <p><strong>${order.customerName}</strong></p>
            <p>${shippingAddress}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                </td>
                <td>${item.quantity}</td>
                <td class="text-right">Rs ${item.price.toFixed(2)}</td>
                <td class="text-right">Rs ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>Rs ${order.subtotal ? order.subtotal.toFixed(2) : order.total.toFixed(2)}</span>
          </div>
          ${order.tax ? `
            <div class="total-row">
              <span>Tax:</span>
              <span>Rs ${order.tax.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="total-row total-final">
            <span>Total:</span>
            <span>Rs ${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your order!</p>
          <p>If you have any questions, please contact us.</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin-bottom: 10px;"><strong>Track Your Order:</strong></p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order?orderId=${order.id}" 
               style="display: inline-block; padding: 12px 24px; background-color: #d4af37; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
              Track Order #${order.id.slice(0, 8).toUpperCase()}
            </a>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
              You can also track your order by visiting our website and entering your Order ID: <strong>${order.id}</strong>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate admin notification HTML
const generateAdminNotificationHTML = (order) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const shippingAddress = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .notification-container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 5px solid #d4af37;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #d4af37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1a1a1a;
          margin: 0;
          font-size: 28px;
        }
        .alert-badge {
          display: inline-block;
          background-color: #ff6b6b;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .order-info div {
          flex: 1;
        }
        .order-info h3 {
          margin-top: 0;
          color: #1a1a1a;
          font-size: 14px;
          text-transform: uppercase;
        }
        .order-info p {
          margin: 5px 0;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #1a1a1a;
          color: #d4af37;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .text-right {
          text-align: right;
        }
        .total-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 16px;
        }
        .total-final {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #d4af37;
        }
        .action-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #d4af37;
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="notification-container">
        <div class="header">
          <h1>🛍️ New Order Received</h1>
          <div class="alert-badge">NEW ORDER</div>
        </div>

        <div class="order-info">
          <div>
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span style="color: #ff6b6b; font-weight: bold;">${order.status.toUpperCase()}</span></p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
          </div>
          <div>
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : '<p><strong>Phone:</strong> Not provided</p>'}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1a1a1a; margin-bottom: 10px;">Shipping Address:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 0;">
            ${shippingAddress}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.quantity}</td>
                <td class="text-right">Rs ${item.price.toFixed(2)}</td>
                <td class="text-right">Rs ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>Rs ${order.subtotal ? order.subtotal.toFixed(2) : order.total.toFixed(2)}</span>
          </div>
          ${order.tax ? `
            <div class="total-row">
              <span>Tax:</span>
              <span>Rs ${order.tax.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="total-row total-final">
            <span>Total Amount:</span>
            <span>Rs ${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="color: #666; margin-bottom: 15px;">Please process this order in the admin panel.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders" class="action-button">View Order in Admin Panel</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send invoice email to customer
export const sendInvoiceEmail = async (order) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"A & N" <${process.env.SMTP_USER || process.env.ADMIN_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - Invoice #${order.id}`,
      html: generateInvoiceHTML(order),
      text: `Thank you for your order!\n\nOrder ID: ${order.id}\nTotal: Rs ${order.total.toFixed(2)}\n\nTrack your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order?orderId=${order.id}\n\nWe will process your order shortly.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent to customer:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
export const sendAdminNotificationEmail = async (order) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured. Skipping admin notification.');
      return { success: false, error: 'ADMIN_EMAIL not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"A & N" <${process.env.SMTP_USER || adminEmail}>`,
      to: adminEmail,
      subject: `🛍️ New Order Received - Order #${order.id}`,
      html: generateAdminNotificationHTML(order),
      text: `New Order Received!\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: Rs ${order.total.toFixed(2)}\n\nPlease check the admin panel for details.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendInvoiceEmail, sendAdminNotificationEmail };

