import { getPlayer } from "@asledgehammer/pipewrench"
import { onAddMessage, onCoopServerMessage, onServerCommand } from "@asledgehammer/pipewrench-events"

onServerCommand.addListener((module, command, args) => {
    getPlayer().Say("Received command")
    // if (module != "TestMod") return

    if (command == "pong") {
        getPlayer().Say("Received command pong!")
    }

})


onAddMessage.addListener((message, tab) => {
    const client = getPlayer().Say("I just sent a message");
    const playername = getPlayer().getName();
    print(playername);
    print("THANKS FOR YOUR MESSAGE");
  })

