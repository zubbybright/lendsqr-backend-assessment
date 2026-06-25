import request from "supertest";
import app from "../../src/app";


let senderId: number;
let recipientId: number;

describe("Wallet", () => {
    beforeEach(async () => {
        const sender = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john@test.com",
                phone: "08011111111",
                password: "password123",
            });

        senderId = sender.body.data.user.id;

        const recipient = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "Jane",
                lastName: "Doe",
                email: "jane@test.com",
                phone: "08022222222",
                password: "password123",
            });

        recipientId = recipient.body.data.user.id;
    });

    it("should fund wallet", async () => {
        const response = await request(app)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                amount: 5000,
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.balance).toBe(5000);
    });

    it("should withdraw funds", async () => {
        await request(app)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                amount: 5000,
            });

        const response = await request(app)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                amount: 2000,
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.balance).toBe(3000);
    });

    it("should reject withdrawal when balance is insufficient", async () => {
        const response = await request(app)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                amount: 1000,
            });

        expect(response.status).toBe(400);
    });

    it("should transfer funds successfully", async () => {
        await request(app)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                amount: 5000,
            });

        const response = await request(app)
            .post("/api/v1/wallet/transfer")
            .set("Authorization", `Bearer ${senderId}`)
            .send({
                recipientUserId: recipientId,
                amount: 1000,
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.reference).toBeDefined();
    });
});