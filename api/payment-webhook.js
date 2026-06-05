import { getN8nSettings } from "./_lib/n8nSettings.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const settings = await getN8nSettings();
  const webhookUrl = settings.N8N_PAYMENT_WEBHOOK_URL;
  if (!webhookUrl) return res.json({ success: false });

  try {
    const { receiptImage, fileName = "receipt.jpg", fileType = "image/jpeg", ...rest } = req.body || {};

    if (receiptImage) {
      const base64Data = receiptImage.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const { FormData, Blob } = await import("node:buffer").catch(() => ({}));

      let form;
      try {
        const { default: FormDataNode } = await import("form-data");
        form = new FormDataNode();
        form.append("data", buffer, { filename: fileName, contentType: fileType });
        form.append("fileName", fileName);
        form.append("fileType", fileType);
        Object.entries(rest).forEach(([k, v]) => form.append(k, String(v)));

        await fetch(webhookUrl, {
          method: "POST",
          headers: form.getHeaders(),
          body: form.getBuffer(),
        });
      } catch {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rest, fileName, fileType, receiptImage }),
        });
      }
    } else {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("[payment-webhook]", err.message);
    return res.json({ success: false, error: err.message });
  }
}
