import inquirer from "inquirer";
const prompt = inquirer.createPromptModule()<{ choice: boolean }>;

export async function promptConfirm(message: string, initial: boolean = true) {
  const res = await prompt({
    name: "choice",
    message,
    type: "confirm",
    default: initial
  });

  return res.choice;
}
