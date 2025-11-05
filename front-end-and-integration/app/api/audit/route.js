import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { ethers } from "ethers";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const provider = new ethers.JsonRpcProvider(process.env.SOMNIA_RPC_URL);
const systemWallet = new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);

// Explorer (e.g., Etherscan-like) setup
const EXPLORER_API_URL = process.env.EXPLORER_API_URL;
const EXPLORER_API_KEY = process.env.EXPLORER_API_KEY;

// FILEBASE
const s3 = new AWS.S3({
  accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID,
  secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY,
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  signatureVersion: "v4",
});

export async function POST(req) {
  try {
    const { code: providedCode, contractAddress: targetContract, userAddress } = await req.json();

    if (!providedCode && !targetContract) {
      return NextResponse.json(
        { error: "Please provide either a contract address or contract source code." },
        { status: 400 }
      );
    }

    let actualCode = providedCode;

    // Try to fetch source from explorer if only contractAddress is given
    if (!actualCode && targetContract) {
      try {
        const resp = await fetch(
          `${EXPLORER_API_URL}?module=contract&action=getsourcecode&address=${targetContract}&apikey=${EXPLORER_API_KEY}`
        );
        const json = await resp.json();

        if (json.result?.length && json.result[0].SourceCode) {
          actualCode = json.result[0].SourceCode;
        } else {
          return NextResponse.json(
            {
              error:
                "Verified source code not found for this address. Please upload the contract code manually.",
              codeRequired: true,
            },
            { status: 404 }
          );
        }
      } catch (err) {
        console.error("Explorer fetch error:", err);
        return NextResponse.json(
          {
            error:
              "Could not fetch contract source from explorer. Please upload your Solidity code manually.",
            codeRequired: true,
          },
          { status: 500 }
        );
      }
    }

    // Run OpenAI Audit
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an expert Solidity security auditor." },
        {
          role: "user",
          content: `Audit this smart contract and summarize key issues:\n${actualCode}`,
        },
      ],
    });

    const fullReport = aiResponse.choices[0].message.content;
    const summary = fullReport.slice(0, 256) + (fullReport.length > 256 ? "..." : "");

    // Upload full report to Filebase
    const fileName = `Audit-${Date.now()}.txt`;
    const params = {
      Bucket: "websitefiles",
      Key: `DreamAudit/${fileName}`,
      Body: fullReport,
      ContentType: "text/plain",
    };

    const cidUrl = await new Promise((resolve, reject) => {
      const request = s3.putObject(params);
      request.on("httpHeaders", (statusCode, headers) => {
        if (statusCode === 200 && headers["x-amz-meta-cid"]) {
          resolve(`https://ipfs.filebase.io/ipfs/${headers["x-amz-meta-cid"]}`);
        } else {
          reject(new Error("Upload failed or CID missing"));
        }
      });
      request.on("error", (err) => reject(err));
      request.send();
    });

    // Return to frontend
    return NextResponse.json({
      message: "Audit completed successfully.",
      summary,
      fullReportIPFS: cidUrl,
      nextStep: "User may now view report or save on-chain.",
    });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json(
      {
        error: "Audit process failed. Please try again.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}