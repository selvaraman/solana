# Solana SOL Transfer Script

This project demonstrates how to transfer SOL (Solana's native cryptocurrency) from one account to another using the Solana Web3.js library.

## Prerequisites

- Node.js version: v24.12.0
- A local Solana validator running (using Surfpool)

## Setup Instructions

1. **Start the local Solana validator:**
   ```bash
   surfpool start
   ```

2. **Access the Solana explorer in your browser:**
   - Open: http://127.0.0.1:18488/
   - RPC URL: http://127.0.0.1:8899

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the script:**
   ```bash
   tsx index.ts
   ```

## How the Script Works

The `index.ts` script performs a complete SOL transfer operation following these steps:

### 1. Connection Setup
The script establishes a connection to the local Solana validator:
```typescript
const connection = new Connection(RPC_URL, "confirmed");
```
- Uses local RPC URL: `http://127.0.0.1:8899`
- Sets commitment level to "confirmed" for transaction reliability

### 2. Keypair Management
The `getKeypair()` function handles wallet creation and persistence:
- **If key file exists**: Reads the existing keypair from the file
- **If key file doesn't exist**: 
  - Generates a new keypair
  - Saves the secret key to a file for future use
  - Returns the new keypair

This ensures that the same wallets are used across multiple script runs.

### 3. Wallet Creation
Two wallets are created:
- **Sender wallet**: Stored in `sender.key` file
- **Receiver wallet**: Stored in `receiver.key` file

### 4. Funding the Sender
The script requests an airdrop for the sender wallet:
```typescript
await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
```
- Requests 1 SOL (1,000,000,000 lamports) from the local validator
- Only works on devnet/localnet environments

### 5. Balance Checking (Before Transfer)
Displays the initial balances of both wallets:
- Shows sender's balance (should be ~1 SOL after airdrop)
- Shows receiver's balance (should be 0 for new wallet)

### 6. Transfer Transaction Creation
Creates a transfer instruction:
```typescript
const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: 0.1 * LAMPORTS_PER_SOL,
});
```
- Transfers 0.1 SOL (100,000,000 lamports) from sender to receiver
- Uses Solana's System Program for native SOL transfers

### 7. Transaction Execution
```typescript
const transaction = new Transaction().add(transferInstruction);
const res = await sendAndConfirmTransaction(connection, transaction, [sender]);
```
- Adds the transfer instruction to a transaction
- Signs the transaction with the sender's keypair
- Sends and waits for confirmation
- Returns the transaction signature

### 8. Balance Verification (After Transfer)
Finally checks both wallet balances to confirm the transfer:
- Sender balance should decrease by ~0.1 SOL plus transaction fees
- Receiver balance should increase by exactly 0.1 SOL

## Key Concepts Demonstrated

- **Keypair Generation**: Creating and managing Solana wallets
- **RPC Connection**: Connecting to Solana network
- **Airdrops**: Requesting SOL from faucet (devnet/localnet only)
- **Balance Queries**: Checking wallet balances
- **SOL Transfers**: Moving native SOL between accounts
- **Transaction Creation**: Building and submitting transactions
- **Transaction Confirmation**: Waiting for transaction finalization

## File Structure

- `index.ts`: Main script file
- `sender.key`: Generated sender wallet keypair (created on first run)
- `receiver.key`: Generated receiver wallet keypair (created on first run)
- `package.json`: Project dependencies and metadata
- `tsconfig.json`: TypeScript configuration

## Dependencies

- `@solana/web3.js`: Official Solana JavaScript SDK
- `@types/node`: TypeScript definitions for Node.js
- `tsx`: TypeScript execution engine
