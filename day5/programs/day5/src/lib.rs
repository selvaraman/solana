use anchor_lang::prelude::*;

declare_id!("56wFvrxWAd5B5Zz6sNLAYvMk38tdYPHJVfnz52TETNcr");

#[program]
pub mod onchain_voting {
    use super::*;
    pub fn init_vote(ctx: Context<InitVote>) -> Result<()> {
        ctx.accounts.vote_account.is_open = true;
        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, vote_type: VoteType) -> Result<()> {
        match vote_type {
            VoteType::GM => {
                ctx.accounts.vote_account.gm += 1;
            }
            VoteType::GN => {
                ctx.accounts.vote_account.gn += 1;
            }
        };
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitVote<'info> {
    #[account(init,payer=signer,space=8+1+8+8)]
    pub vote_account: Account<'info, VoteBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub vote_account: Account<'info, VoteBank>,
    pub signer: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct VoteBank {
    pub is_open: bool,
    pub gm: u64,
    pub gn: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum VoteType {
    GM,
    GN,
}
