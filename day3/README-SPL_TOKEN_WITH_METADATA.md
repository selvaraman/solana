# SPL Token with Metadata Creation Guide

This guide demonstrates how to create, manage, and transfer SPL tokens with metadata using the Solana Token Extensions program.

## Prerequisites
- Solana CLI installed and configured
- Two keypairs: `keys/alice.json` (token creator) and `keys/bob.json` (recipient)
- Sufficient SOL for transaction fees

## Step-by-Step Process

### 1. Configure Solana CLI
```bash
solana config get --keypair keys/alice.json --url devnet
```
Set up the Solana CLI to use Alice's keypair on devnet for token creation.

### 2. Create SPL Token with Metadata Extension
```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata
```
Creates a new SPL token using the Token Extensions program with metadata capability enabled.

### 3. Export Token Mint Address
```bash
export TOKEN_MINT_ADDRESS=2PNET7dMrgJ57qLErmRpp1wJyBCYAuJFqWBijYKhaA6T
```
Store the token mint address from step 2 output for reuse in subsequent commands.

### 4. Initialize Token Metadata
```bash
spl-token initialize-metadata $TOKEN_MINT_ADDRESS "SPL Token" "SPLT" "https://raw.githubusercontent.com/selvaraman/solana/main/day3/metadata.json"
```
Sets the token's metadata including name ("SPL Token"), symbol ("SPLT"), and URI pointing to detailed metadata JSON.

### 5. Create Associated Token Account (Alice)
```bash
spl-token create-account $TOKEN_MINT_ADDRESS
```
Creates an associated token account for Alice to hold the newly created tokens.

### 6. Mint Tokens to Alice
```bash
spl-token mint $TOKEN_MINT_ADDRESS 1000
```
Mints 1000 tokens to Alice's associated token account (Alice is the mint authority).

### 7. Switch to Bob's Account
```bash
solana config set --keypair keys/bob.json --url devnet
```
Changes the active keypair to Bob for setting up his token account.

### 8. Setup Bob's Token Account
Prepare Bob's account to receive tokens:

#### 8.1. Airdrop SOL to Bob
```bash
solana airdrop 2
```
Provides Bob with SOL needed for transaction fees and account creation.

#### 8.2. Create Associated Token Account for Bob
```bash
spl-token create-account $TOKEN_MINT_ADDRESS
```
Creates Bob's associated token account for the specific token mint.

### 9. Switch Back to Alice
```bash
solana config set --keypair keys/alice.json --url devnet
```
Return to Alice's account to perform the token transfer.

### 10. Transfer Tokens to Bob
```bash
spl-token transfer $TOKEN_MINT_ADDRESS 150 62kvaCG9mMLF2GYRTaUp7HWnT1LpiYhRCjcsd1o8qn79
```
Transfers 150 tokens from Alice to Bob's associated token account address.

### 11. Verify Transfer (Bob's Perspective)
```bash
solana config set --keypair keys/bob.json --url devnet
spl-token accounts
```
Switch to Bob's account and check all token account balances to confirm receipt of tokens.

## Key Concepts

- **Token Extensions Program**: Enhanced SPL token program supporting metadata and other extensions
- **Metadata Extension**: Allows tokens to store name, symbol, and URI on-chain
- **Associated Token Accounts**: Deterministic token accounts derived from owner and mint addresses
- **Mint Authority**: Account with permission to create new tokens (Alice in this example)
