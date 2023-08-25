import * as Amplitude from 'expo-analytics-amplitude';

const disable = false;
let isInitialized = false;
const apiKey = process.env.REACT_APP_AMPLITUDE_API;

function initialize() {
  if (disable || !apiKey) return false;

  if (!isInitialized) {
    Amplitude.initializeAsync(apiKey);
    isInitialized = true;
  }

  return true;
}

export function track(event, options) {
  if (!initialize()) return;

  if (options) return Amplitude.logEventWithPropertiesAsync(event, options);

  Amplitude.logEventAsync(event);
}

/**
 * Use to track the steps of a specific flow.
 * FLOW: SECTION > SUBSECTION > SUBSECTION > ... [ACTION]
 *
 * @param {string} flow
 * @param {string} section
 * @param {object} subsections
 * @param {string} action
 * @param {object} options
 */
export function trackFlow(flow, section, subsections = [], action, options) {
  let event = `${flow.toUpperCase()}: ${section.toUpperCase()}`;

  if (subsections)
    event += ` > ${subsections.map(x => x.toUpperCase()).join(' > ')}`;

  event += ` [${action.toUpperCase()}]`;

  track(event, options);
}
