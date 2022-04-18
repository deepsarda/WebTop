let cmds = [
  {
    name: "help",
    description: "Show the available commands",
    callback: async function (args, terminal) {
      let output = "";
      for (let i = 0; i < cmds.length; i++) {
        output += `${cmds[i].name} - ${cmds[i].description} <br> `;
      }

      return { text: output, success: true };
    },
  },
  {
    name: "about",
    description: "Send some  info about aeona and webtop",
    callback: async function (args, terminal) {
      return {
        text: ' <a href="https://aeona.repl.co">Click here to learn more about me. </a> <a href="/">Click here to learn more about webtop. </a>',
        success: true,
      };
    },
  },
];
