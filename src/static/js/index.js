//function to wait for specified time
async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class Terminal {
  constructor() {
    this.terminal = $(".terminal");
    console.log(cmds);
    this.cmds = cmds;
  }

  async sendLine(line) {
    this.terminal.append(`<p class="output"> </p>`);
    await this.animate(line);
  }

  async animate(text) {
    let chars = text.split("");
    //Loop through each character
    for (let i = 0; i < chars.length; i++) {
      //Wait for a bit
      await wait(10);
      //Add the character to the terminal
      let output=$(".output").last();
      output.html(output.html() + chars[i]);
    }
  }

  async sendError(error, errorCode) {
    // Wait 0.5 seconds
    await wait(500);
    this.terminal.append(
      `<h1>${error} <span class="errorcode">${errorCode}</span></h1>`
    );
  }

  async sendTitle(title) {
    // Wait 0.5 seconds
    await wait(500);
    this.terminal.append(`<h1>${title}</h1>`);
  }

  async requestUserInput(
    validInputCheck = this.validInputCheck,
    options = { name: "unkown", hostname: "mainframe" }
  ) {
    // Wait 0.5 seconds
    await wait(500);
    this.terminal.append(
      `<p class="output">${options.name}@${options.hostname}:~$ <input type="text" id="input" autofocus></p>`
    );
    let terminal = this;
    $("#input").keypress(async function (e) {
      if (e.which == 13) {
        let input = $(this).val();
        $(this).val("");
        $(".output").last().remove();
        let success = false;
        //Remove the last line after waiting 0.1 seconds
        let cmd = await validInputCheck(input, terminal);
        if (cmd) {
          let result = await cmd.callback(cmd.args, terminal);
          if (result.success) {
            await terminal.sendLine(result.text);
            success = true;
          } else {
            await terminal.sendLine(result.text);
          }
        } else {
          await terminal.sendLine(
            `I'm sorry, I don't understand what you mean by ${input}`
          );
        }
        await terminal.requestUserInput();
    
      }
    });
  }

  async validInputCheck(input, terminal) {
    let words = input.split(" ");
    let cmd = words[0];
    let args = words.slice(1);
    let cmdFound = false;
    for (let i = 0; i < terminal.cmds.length; i++) {
      if (cmd.toLowerCase() == terminal.cmds[i].name) {
        cmdFound = true;
        terminal.cmds[i].args = args;
        return terminal.cmds[i];
      }
    }
    if (!cmdFound) {
      return false;
    }
  }
}
