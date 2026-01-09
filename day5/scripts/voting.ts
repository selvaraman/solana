import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
} from "@solana/web3.js";
import fs from "fs";

const PROGRAM_ID = new PublicKey(
  "56wFvrxWAd5B5Zz6sNLAYvMk38tdYPHJVfnz52TETNcr"
);
const RPC_URL = "http://127.0.0.1:8899";

const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync("/Users/selvam/.config/solana/id.json", "utf8"))
  )
);

const wallet = new anchor.Wallet(walletKeypair);
const connection = new anchor.web3.Connection(RPC_URL, "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

const INIT_VOTE_DISCRIMINATOR = Buffer.from([
  46, 31, 64, 181, 113, 149, 42, 164,
]);
const CAST_VOTE_DISCRIMINATOR = Buffer.from([
  20, 212, 15, 189, 69, 180, 69, 151,
]);

async function initializeVote() {
  try {
    const voteAccount = anchor.web3.Keypair.generate();

    console.log("Initializing vote account...");
    console.log("Vote account public key:", voteAccount.publicKey.toBase58());

    const initVoteInstruction = new TransactionInstruction({
      keys: [
        {
          pubkey: voteAccount.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: PROGRAM_ID,
      data: INIT_VOTE_DISCRIMINATOR,
    });

    const transaction = new Transaction().add(initVoteInstruction);
    const tx = await provider.sendAndConfirm(transaction, [voteAccount]);

    console.log("init_vote tx:", tx);
    console.log("Vote account initialized successfully!");

    return voteAccount.publicKey;
  } catch (error) {
    console.error("Error initializing vote:", error);
    throw error;
  }
}

async function castVote(voteAccountPubkey: PublicKey, voteType: "GM" | "GN") {
  try {
    console.log(`Casting ${voteType} vote...`);

    let voteTypeData: Buffer;
    if (voteType === "GM") {
      voteTypeData = Buffer.from([0]); // GM variant index 0
    } else {
      voteTypeData = Buffer.from([1]); // GN variant index 1
    }

    const instructionData = Buffer.concat([
      CAST_VOTE_DISCRIMINATOR,
      voteTypeData,
    ]);

    const castVoteInstruction = new TransactionInstruction({
      keys: [
        {
          pubkey: voteAccountPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: PROGRAM_ID,
      data: instructionData,
    });

    const transaction = new Transaction().add(castVoteInstruction);
    const tx = await provider.sendAndConfirm(transaction, []);

    console.log(`${voteType} vote cast successfully! tx:`, tx);
  } catch (error) {
    console.error(`Error casting ${voteType} vote:`, error);
    throw error;
  }
}

async function getVoteAccount(voteAccountPubkey: PublicKey) {
  try {
    const accountInfo = await connection.getAccountInfo(voteAccountPubkey);
    if (!accountInfo) {
      throw new Error("Vote account not found");
    }

    const data = accountInfo.data;
    if (data.length < 25) {
      throw new Error("Account data too short");
    }

    console.log("Raw account data length:", data.length);
    console.log("Raw account data (first 32 bytes):", data.slice(0, 32));

    const isOpen = data[8] === 1;

    const gmBytes = data.slice(9, 17);
    const gnBytes = data.slice(17, 25);

    let gm = 0n;
    let gn = 0n;

    for (let i = 0; i < 8; i++) {
      gm += BigInt(gmBytes[i]) << (BigInt(i) * 8n);
      gn += BigInt(gnBytes[i]) << (BigInt(i) * 8n);
    }

    console.log("Vote Account State:");
    console.log("Is Open:", isOpen);
    console.log("GM Votes:", gm.toString());
    console.log("GN Votes:", gn.toString());

    return { isOpen, gm, gn };
  } catch (error) {
    console.error("Error fetching vote account:", error);
    throw error;
  }
}

(async () => {
  try {
    const voteAccountPubkey = await initializeVote();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await castVote(voteAccountPubkey, "GM");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await castVote(voteAccountPubkey, "GN");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await castVote(voteAccountPubkey, "GM");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await getVoteAccount(voteAccountPubkey);
  } catch (error) {
    console.error("Script execution failed:", error);
    process.exit(1);
  }
})();
