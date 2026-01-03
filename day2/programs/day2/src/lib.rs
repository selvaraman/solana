use anchor_lang::prelude::*;

declare_id!("ANriqAUKT6hLBGt4r8ndk8vf1jRVr45dCTbBpVoN9voh");

#[program]
pub mod day2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
