export class KarmaService {
  async isBlacklisted(identity: string): Promise<boolean> {
    const response = await fetch(
      `${process.env.ADJUTOR_BASE_URL}/v2/verification/karma/${encodeURIComponent(
        identity
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify karma blacklist");
    }

    const result = await response.json();

    return Boolean(result?.data);
  }
}