use anchor_lang::prelude::*;

declare_id!("AztsNuLWDTv5uu8pAGXxxhqMwdHd843Z7418XVpBaVJx");

#[program]
pub mod day4 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
