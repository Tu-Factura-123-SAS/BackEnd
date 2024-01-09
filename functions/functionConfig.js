/* Configuration objects for different function types
128MB: 200 MHz
256MB: 400 MHz
512MB: 800 MHz
1GB: 1.4 GHz
2GB: 2.4 GHz
4GB: 4.8 GHz
8GB: 4.8 GHz
 */
module.exports = {
  mb128: {
    timeoutSeconds: 540,
    memory: "128MB",
    minInstances: 1,
    maxInstances: 100,
    enforceAppCheck: true, // Enable App Check protection.
  },
  mb256: {
    timeoutSeconds: 540,
    memory: "256MB",
    minInstances: 0,
    maxInstances: 100,
    enforceAppCheck: true, // Enable App Check protection.
  },
  gb4: {
    timeoutSeconds: 540,
    memory: "4GB",
    minInstances: 0,
    maxInstances: 10,
    enforceAppCheck: true, // Enable App Check protection.
  },
  v0api256mb: {
    timeoutSeconds: 540,
    memory: "256MB",
    minInstances: 1,
    maxInstances: 100,
    enforceAppCheck: false, // Note: Disable App Check protection.
  },
};
