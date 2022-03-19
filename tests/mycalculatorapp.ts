import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Mycalculatorapp } from "../target/types/mycalculatorapp";

describe("mycalculatorapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatorapp as Program<Mycalculatorapp>;

  it("Creates a calculator", async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [calculator],
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.greeting == "Welcome to Solana");
  });

  it("Add two numbers", async () => {
    await program.rpc.add(new anchor.BN(1), new anchor.BN(2), {
      accounts: { calculator: calculator.publicKey },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eqn(3));
  });

  it("Subtract two numbers", async () => {
    await program.rpc.subtract(new anchor.BN(2), new anchor.BN(1), {
      accounts: { calculator: calculator.publicKey },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eqn(1));
  });

  it("Multiply two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(1), new anchor.BN(2), {
      accounts: { calculator: calculator.publicKey },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eqn(2));
  });

  it("Divide two numbers", async () => {
    await program.rpc.divide(new anchor.BN(31), new anchor.BN(2), {
      accounts: { calculator: calculator.publicKey },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);

    assert.ok(account.result.eqn(15));
    assert.ok(account.remainder.eqn(1));
  });
});
