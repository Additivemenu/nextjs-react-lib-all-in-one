import AdvancedOnboarding from "./advanced-onboarding";

/**
 * still a bit problematic
 *
 * need to check:
 * - if we can move to next step programmatically?
 *   - !in our case, moving to next step can be triggered by a variety of events, such as clicking on a button, user drag over a node, ....
 *   - async tour might be useful in this case https://driverjs.com/docs/async-tour
 * - if the onboarding popover can disable clicking on outside of the popover? yes
 * - can the element in step3, 5 be the same?
 *
 *
 * @returns
 */
const Page = () => {
  return (
    <div>
      <AdvancedOnboarding />{" "}
    </div>
  );
};

export default Page;
