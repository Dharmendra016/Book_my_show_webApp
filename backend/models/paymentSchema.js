const paymentModel = `
    CREATE TABLE IF NOT EXISTS "Payment"(
        PaymentID SERIAL PRIMARY KEY,
        BookingID INT NOT NULL,
        Amount DECIMAL NOT NULL,
        PaymentMethod VARCHAR(50) NOT NULL,
        PaymentStatus VARCHAR(50) NOT NULL,
        TransactionID VARCHAR(100) UNIQUE NOT NULL,
        Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (BookingID) REFERENCES "Booking"(BookingID) ON DELETE CASCADE
    );
`;

const paymentInput = `
    INSERT INTO "Payment"(BookingID, Amount, PaymentMethod, PaymentStatus, TransactionID)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;

const initializePaymentTable = async () => {
    try {
        await client.query(paymentModel);
        console.log("Successfully created the Payment table or it already exists.");
    } catch (error) {
        console.error("Error creating Payment table:", error.message);
    }
};

const insertPayment = async ({ BookingID, Amount, PaymentMethod, PaymentStatus, TransactionID }) => {
    try {
        const result = await client.query(paymentInput, [
            BookingID,
            Amount,
            PaymentMethod,
            PaymentStatus,
            TransactionID,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting payment:", error.message);
        throw error;
    }
};

export { initializePaymentTable, insertPayment };
