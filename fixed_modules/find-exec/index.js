const spawnSync = require('child_process').spawnSync,
    platform = require('os').platform()

module.exports = function(){
  var self = this
    , commands = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.apply(arguments)
    , command = null

  commands.some(function(c){
    let commandToExec = findCommand(c)
    let code = spawnSync(commandToExec.osCommand, [commandToExec.wantedCommand], {
      shell: true
    }).status
    if(code === 0){
        command = c
        return true
    }
  })
  return command
}

function findCommand(command){
  let fullcommand = {}
  if (/^win/.test(platform)){
    fullcommand.osCommand = "where"
    fullcommand.wantedCommand = command
    return fullcommand
  } else {
      fullcommand.osCommand = "command"
      fullcommand.wantedCommand = "-v " + command
      return fullcommand
  }
}
