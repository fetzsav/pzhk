/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

// PipeWrench API.
import { getPlayer } from '@asledgehammer/pipewrench';
import * as Events from '@asledgehammer/pipewrench-events';
import { isClient, isServer, sendServerCommand, triggerEvent } from "@asledgehammer/pipewrench"
import { onClientCommand } from "@asledgehammer/pipewrench-events"
// Example reference API.

// Add all initialization code here.
Events.onGameStart.addListener(() => {
  print('Hello, world! EDITED');
});

onClientCommand.addListener((module, command, player, args) => {

  if (isClient()) return; // dont execute on clients
  print(module);
  if (module != "TestMod") return

  if (command == "ping") {
      print("Server received command ping!")

      if (isServer()) 
          sendServerCommand(player, "HungerGames", "pong", args) // send normally if server
      else 
          triggerEvent("OnServerCommand", "HungerGames", "pong", args) // send hack for single-player
  }

})


// Events.onAddMessage.addListener((message, tab) => {
//   const client = getPlayer();
//   print("THANKS FOR YOUR MESSAGE", client.getName());
// })

// Events.onCoopServerMessage.addListener((message, nick, id) => {
//   const client = getPlayer();
//   print("coop message client getName:", client.getName());
//   print("coop message message:", message);
//   print("coop message nick:", nick);
//   print("coop message id:", id);
// })


Events.onClientCommand.addListener((module, command, player, args) => {
  const client = getPlayer();
  print("client getName:", client.getName());
  print("client module:", module);
  print("client command:", command);
  print("client player:", player);
  print("client args:", args);
})

