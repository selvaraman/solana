# Solana SPL Token Creation and Transfer Tutorial

This tutorial demonstrates how to create SPL tokens on Solana devnet and transfer them between accounts. We'll create two accounts (Alice and Bob), mint SPL tokens in Alice's account, and transfer tokens to Bob.

## Prerequisites

- Solana CLI tools installed
- SPL Token CLI tools installed
- Access to Solana devnet

## Tutorial Steps

### 1. Create User Accounts

Create keypairs for Alice and Bob:

```bash
# Create Alice's account
solana-keygen new -o keys/alice.json

# Create Bob's account  
solana-keygen new -o keys/bob.json
```

### 2. Configure Solana CLI

Set the network to devnet and Alice as the default keypair:

```bash
solana config set --url devnet --keypair keys/alice.json
```

### 3. Fund Alice's Account

Airdrop SOL to Alice's account for transaction fees:

```bash
solana airdrop 2
```

### 4. Create SPL Token

Create a new SPL token mint:

```bash
spl-token create-token
```

Export the token mint address for easier reference:

```bash
export SPL_TOKEN_MINT_ADDRESS=<your_token_mint_address>
```

### 5. Create Token Account for Alice

Create an associated token account for Alice to hold the SPL tokens:

```bash
spl-token create-account $SPL_TOKEN_MINT_ADDRESS
```

### 6. Mint Tokens to Alice

Mint 100 tokens to Alice's token account:

```bash
spl-token mint $SPL_TOKEN_MINT_ADDRESS 100
```

### 7. Verify Token Supply

Check the total supply of your SPL token:

```bash
spl-token supply $SPL_TOKEN_MINT_ADDRESS
```

### 8. Transfer Tokens to Bob

Get Bob's wallet address and transfer tokens to him:

```bash
# Get Bob's address
solana address -k keys/bob.json

# Transfer 25 tokens to Bob
spl-token transfer $SPL_TOKEN_MINT_ADDRESS 25 <bob_address> --fund-recipient --allow-unfunded-recipient
```

## Key Concepts

- **Associated Token Account**: Each wallet needs an associated token account to hold specific SPL tokens
- **Token Mint**: The authority that can create new tokens of a specific type
- **Fund Recipient**: Automatically creates and funds Bob's associated token account during transfer

## Transaction Details

The transfer operation performs two actions:
1. Creates an associated token account for Bob (if it doesn't exist)
2. Transfers the specified amount of tokens from Alice to Bob
3. Funds Bob's token account creation (~0.00203928 SOL)

## Notes

- Token transfers require the recipient to have an associated token account
- Creating token accounts requires a small amount of SOL for rent
