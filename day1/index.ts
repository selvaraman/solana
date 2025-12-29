import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

//1. create connection - Connection
//2. generate key - Keypair
//3. Request Airdrop
//4. get balance - getBalance
//5. create transfer instruction - SystemProgram
//6. add to transaction - Transaction
//7. send and confirm transaction - sendAndConfirmTransaction
//8. get balance after transfer

const connection = new Connection("http://127.0.0.1:8899", "confirmed"); //Commitment Level: {processed, confirmed, finalized}
const sender = Keypair.generate();
const receiver = Keypair.generate();
(async () => {
  await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
  console.log(
    `Sender (before transfer) ${sender.publicKey}: ${await connection.getBalance(sender.publicKey)}`,
  );
  console.log(
    `Receiver (before transfer) ${receiver.publicKey}: ${await connection.getBalance(receiver.publicKey)}`,
  );
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });
  const transaction = new Transaction().add(transferInstruction);
  const res = await sendAndConfirmTransaction(connection, transaction, [
    sender,
  ]);
  console.log("Transaction:", res);
  console.log(`Sender (after transfer) ${sender.publicKey} : ${await connection.getBalance(sender.publicKey)}`);
  console.log(`Receiver (after transfer) ${receiver.publicKey} : ${await connection.getBalance(receiver.publicKey)}`);
})();
