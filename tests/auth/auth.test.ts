import request from "supertest";
import app from "../../src/app";

describe("Authentication", () => {
    it("should register a user successfully", async () => {
        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john@test.com",
                phone: "08011111111",
                password: "password123",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe("john@test.com");
        expect(response.body.data.wallet.balance).toBe(0);
    });

    it("should reject duplicate email", async () => {
        await request(app).post("/api/v1/auth/register").send({
            firstName: "John",
            lastName: "Doe",
            email: "duplicate@test.com",
            phone: "08011111112",
            password: "password123",
        });

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "Jane",
                lastName: "Doe",
                email: "duplicate@test.com",
                phone: "08011111113",
                password: "password123",
            });

        expect(response.status).toBe(409);
    });

    it("should reject a blacklisted user", async () => {
        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    reason: "Blacklisted",
                },
            }),
        } as Response);

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "blacklisted@test.com",
                phone: "08099999999",
                password: "password123",
            });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
    });
});