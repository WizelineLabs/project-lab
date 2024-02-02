import { SSTConfig } from "sst";
import { Service } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "remix-project-lab",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const service = new Service(stack, "service", {
        port: 3000,
      });

      stack.addOutputs({
        ServiceUrl: service.url,
      });
    });
  },
} satisfies SSTConfig;
