import { Participant, registerPlugin } from '@pexip/plugin-api';

// Register the plugin with the specified ID and version
const plugin = await registerPlugin({
  id: 'showhidepreso-plugin',
  version: 0,
});

// Constants for button labels and position
const BUTTON_POSITION = 'participantActions';
const HIDE_PRESO_TEXT = 'Hide presentation';
const SHOW_PRESO_TEXT = 'Show presentation';

// Add show and hide presentation buttons to the participant actions UI
const btnHide = await plugin.ui.addButton({ position: BUTTON_POSITION, label: HIDE_PRESO_TEXT });
const btnShow = await plugin.ui.addButton({ position: BUTTON_POSITION, label: SHOW_PRESO_TEXT });

// Event listener for participant updates
plugin.events.participants.add(async ({ participants }) => {
  // Arrays to hold identities of hide show presentation participants
  const hidePresentation = [];
  const showPresentation = [];

  // Iterate through participants and categorize them based on their rxPresentation status
  for (const participant of participants) {

     if (!participant.rxPresentation) {
      hidePresentation.push(participant.identity);
    } else {
      showPresentation.push(participant.identity);
    }
  }

  // Update the show / hide presentation button based on condition
  if (hidePresentation.length > 0) {
    await btnShow.update({ position: BUTTON_POSITION, label: SHOW_PRESO_TEXT, participantIDs: hidePresentation });
  } else {
    await btnShow.update({ position: BUTTON_POSITION, label: SHOW_PRESO_TEXT, participantIDs: [] });
  }

  if (showPresentation.length > 0) {
    await btnHide.update({ position: BUTTON_POSITION, label: HIDE_PRESO_TEXT, participantIDs: showPresentation });
  } else {
    await btnHide.update({ position: BUTTON_POSITION, label: HIDE_PRESO_TEXT, participantIDs: [] });
  }
});

// Button click action for hide presentation for the selected participant
btnHide.onClick.add(async ({ participantUuid }) => {
  plugin.conference.sendRequest({
    method: 'POST',
    path: 'participants/' + participantUuid + '/denyrxpresentation'
   });
});

// Button click action for show presentation for the selected participant
btnShow.onClick.add(async ({ participantUuid }) => {
  plugin.conference.sendRequest({
    method: 'POST',
    path: 'participants/' + participantUuid + '/allowrxpresentation'
  });
});

