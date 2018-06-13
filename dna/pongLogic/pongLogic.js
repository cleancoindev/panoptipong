/*=============================================
=            Public Zome Functions            =
=============================================*/



function updateState (oldGameState){
  var newGameState =
  { ball: oldGameState.ball,
    paddleLeft: oldGameState.paddleLeft,
    paddleRight: oldGameState.paddleRight
  };
  newGameState = updatePaddles(newGameState);
  newGameState = updateBall(newGameState);
  if (isGameOver(newGameState)) {
    return "Game Over";
  };
  return newGameState;
}


function registerAgent(payload) {
  if (App.Key.Hash !== property("progenitorHash")) {
    return JSON.parse(send(property("progenitorHash"), { type: "init"}));
  } else {
    return null;
  }
}


/*=====  End of Public Zome Functions  ======*/


function updateBall(gameState){
  var ball = gameState.ball;
  var paddleLeft = gameState.paddleLeft;
  var paddleRight = gameState.paddleRight;
  ball.ballPosition.x += ball.ballVelocity.x;
  ball.ballPosition.y += ball.ballVelocity.y;
 if (ball.ballPosition.y < 0) {
   ball.ballPosition.y = 0 - ball.ballPosition.y;
   ball.ballVelocity.y = -ball.ballVelocity.y;
  };
 if (ball.ballPosition.y > 100) {
  ball.ballPosition.y = 100 - (ball.ballPosition.y - 100);
  ball.ballVelocity.y = -ball.ballVelocity.y;
  };
  if (ball.ballPosition.x < 2 || ball.ballPosition.x > 98) {
    //possible ball-paddle collision, check y axis now
    //TODO: replace ints with paddleSize const
    if (paddleLeft.position < ball.ballPosition.y < paddleLeft.position + 5 ) {

    }
  }
return gameState;
}



function updatePaddles(gameState) {
  //TODO: add check for paddle-board collision with paddleSize const
  var paddleMovementVotes = getVotes();
  gameState.paddleLeft.position += paddleMovementVotes.left;
  gameState.paddleRight.position += paddleMovementVotes.right;
}

function isGameOver(gameState){
  //TODO: replace ints with consts for board size
  if (gameState.ball.ballPosition.x < 1 || gameState.ball.ballPosition.x > 99)
  {
    return true;
  };
    return false;
}


/*******************************************************************************
 * Required callbacks
 ******************************************************************************/

/**
 * System genesis callback: Can the app start?
 *
 * Executes just after the initial genesis entries are committed to your chain
 * (1st - DNA entry, 2nd Identity entry). Enables you specify any additional
 * operations you want performed when a node joins your holochain.
 *
 * @return {boolean} true if genesis is successful and so the app may start.
 *
 * @see https://developer.holochain.org/API#genesis
 */
function genesis () {
  return true;
}

/**
 * Validation callback: Can this entry be committed to a source chain?
 *
 * @param  {string} entryType Type of the entry as per DNA config for this zome.
 * @param  {string|object} entry Data with type as per DNA config for this zome.
 * @param  {Header-object} header Header object for this entry.
 * @param  {Package-object|null} pkg Package object for this entry, if exists.
 * @param  {string[]} sources Array of agent hashes involved in this commit.
 * @return {boolean} true if this entry may be committed to a source chain.
 *
 * @see https://developer.holochain.org/API#validateCommit_entryType_entry_header_package_sources
 * @see https://developer.holochain.org/Validation_Functions
 */
function validateCommit (entryType, entry, header, pkg, sources) {
  return true;
}

/**
 * Validation callback: Can this entry be committed to the DHT on any node?
 *
 * It is very likely that this validation routine should check the same data
 * integrity as validateCommit, but, as it happens during a different part of
 * the data life-cycle, it may require additional validation steps.
 *
 * This function will only get called on entry types with "public" sharing, as
 * they are the only types that get put to the DHT by the system.
 *
 * @param  {string} entryType Type of the entry as per DNA config for this zome.
 * @param  {string|object} entry Data with type as per DNA config for this zome.
 * @param  {Header-object} header Header object for this entry.
 * @param  {Package-object|null} pkg Package object for this entry, if exists.
 * @param  {string[]} sources Array of agent hashes involved in this commit.
 * @return {boolean} true if this entry may be committed to the DHT.
 *
 * @see https://developer.holochain.org/API#validatePut_entryType_entry_header_package_sources
 * @see https://developer.holochain.org/Validation_Functions
 */
function validatePut (entryType, entry, header, pkg, sources) {
  return true;
}



function validateLink(entryType, hash, links, package, sources) {
  return true;
}

/**
 * Validation callback: Can this entry be modified?
 *
 * Validate that this entry can replace 'replaces' due to 'mod'.
 *
 * @param  {string} entryType Type of the entry as per DNA config for this zome.
 * @param  {string|object} entry Data with type as per DNA config for this zome.
 * @param  {Header-object} header Header object for this entry.
 * @param  {string} replaces The hash string of the entry being replaced.
 * @param  {Package-object|null} pkg Package object for this entry, if exists.
 * @param  {string[]} sources Array of agent hashes involved in this mod.
 * @return {boolean} true if this entry may replace 'replaces'.
 *
 * @see https://developer.holochain.org/API#validateMod_entryType_entry_header_replaces_package_sources
 * @see https://developer.holochain.org/Validation_Functions
 */
function validateMod (entryType, entry, header, replaces, pkg, sources) {
  return validateCommit(entryType, entry, header, pkg, sources)
    // Only allow the creator of the entity to modify it.
    && getCreator(header.EntryLink) === getCreator(replaces);
}

/**
 * Validation callback: Can this entry be deleted?
 *
 * @param  {string} entryType Name of the entry as per DNA config for this zome.
 * @param  {string} hash The hash of the entry to be deleted.
 * @param  {Package-object|null} pkg Package object for this entry, if exists.
 * @param  {string[]} sources Array of agent hashes involved in this delete.
 * @return {boolean} true if this entry can be deleted.
 *
 * @see https://developer.holochain.org/API#validateDel_entryType_hash_package_sources
 * @see https://developer.holochain.org/Validation_Functions
 */
function validateDel (entryType, hash, pkg, sources) {
  return isValidEntryType(entryType)
    // Only allow the creator of the entity to delete it.
    && getCreator(hash) === sources[0];
}

/**
 * Package callback: The package request for validateCommit() and valdiatePut().
 *
 * Both 'commit' and 'put' trigger 'validatePutPkg' as 'validateCommit' and
 * 'validatePut' must both have the same data.
 *
 * @param  {string} entryType Name of the entry as per DNA config for this zome.
 * @return {PkgReq-object|null}
 *   null if the data required is the Entry and Header.
 *   Otherwise a "Package Request" object, which specifies what data to be sent
 *   to the validating node.
 *
 * @see https://developer.holochain.org/API#validatePutPkg_entryType
 * @see https://developer.holochain.org/Validation_Packaging
 */
function validatePutPkg (entryType) {
  return null;
}

/**
 * Package callback: The package request for validateMod().
 *
 * @param  {string} entryType Name of the entry as per DNA config for this zome.
 * @return {PkgReq-object|null}
 *   null if the data required is the Entry and Header.
 *   Otherwise a "Package Request" object, which specifies what data to be sent
 *   to the validating node.
 *
 * @see https://developer.holochain.org/API#validateModPkg_entryType
 * @see https://developer.holochain.org/Validation_Packaging
 */
function validateModPkg (entryType) {
  return null;
}

/**
 * Package callback: The package request for validateDel().
 *
 * @param  {string} entryType Name of the entry as per DNA config for this zome.
 * @return {PkgReq-object|null}
 *   null if the data required is the Entry and Header.
 *   Otherwise a "Package Request" object, which specifies what data to be sent
 *   to the validating node.
 *
 * @see https://developer.holochain.org/API#validateDelPkg_entryType
 * @see https://developer.holochain.org/Validation_Packaging
 */
function validateDelPkg (entryType) {
  return null;
}



/*=================================
=            Messaging            =
=================================*/

function receive(from, message) {
  if(message.type === "init") {
    if(hasBeenAssigned(from)){
      return "AlreadyAssigned";
    }

    // get the most recent team designation
    var response = query({
      Return: {
        Entries: true
      },
      Constrain: {
        EntryTypes: ["TeamDesignation"],
        Count: 1
      },
      Order: {
        Ascending: true
      }
    });

    var nextTeam;
    if(response[0]) {
      nextTeam = (response[0]["team"] === "left") ? "right" : "left"
    } else {
      nextTeam = "left";
    }

    commit("TeamDesignation", {
      agentHash: from,
      team: nextTeam
    });

    return {team: nextTeam};
  }
  return null;
}

/*=====  End of Messaging  ======*/

/*=======================================
=            Local Functions            =
=======================================*/

function hasBeenAssigned(agentHash) {
  var result = query({
    Constrain: {
      EntryTypes: ["TeamDesignation"],
      Contains: "{\"agentHash\": \""+agentHash+"\"}"
    }
  });

  return result.length > 0;
}

/*=====  End of Local Functions  ======*/
