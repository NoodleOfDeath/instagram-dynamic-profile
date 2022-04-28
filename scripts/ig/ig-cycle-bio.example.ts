// Import modules
import { IgDPCycleBioTask, IgDPSession } from '../../src';

// Cycle profile picture with images found in `./img` every 30 seconds.
const session = (props: { username: string; password: string }) =>
  new IgDPSession({
    ...props,
    tasks: [
      new IgDPCycleBioTask((): string => {
        return `Today's timestamp is:\n${new Date()}`;
      }, 30000),
    ],
  });

export default session;