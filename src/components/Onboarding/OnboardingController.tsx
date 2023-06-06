import {useAppSelector} from "store";
import {isEqual} from "underscore";
import Floater from "react-floater";
import {ReactComponent as StanIcon} from "assets/stan/Stan_ellipse_logo.svg";
import {shallowEqual, useDispatch} from "react-redux";
import {Actions} from "store/action";
import {useTranslation} from "react-i18next";
import {OnboardingBase} from "./OnboardingBase";
import onboardingNotes from "./onboardingNotes.en.json";
import "./Onboarding.scss";

export const OnboardingController = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const phase = useAppSelector((state) => state.onboarding.phase, isEqual);
  const step = useAppSelector((state) => state.onboarding.step, isEqual);
  const phaseStep = `${phase}-${step}`;
  const stepOpen = useAppSelector((state) => state.onboarding.stepOpen, isEqual);
  const rootState = useAppSelector((state) => state, shallowEqual);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const spawnNotes = (columnName: string) => {
    const column = rootState.columns.find((c) => c.name === columnName);
    if (column) {
      onboardingNotes[columnName].forEach((n: {text: string; author: string}) => {
        setTimeout(() => {
          dispatch(Actions.addOnboardingNote(column?.id ?? "", n.text, n.author));
        }, 200);
      });
    }
  };

  switch (phaseStep) {
    /* phase "intro" handles itself - phase "none" has no onboarding activities */
    case "newBoard-1":
      break;
    case "newBoard-2":
      break;
    case "board_check_in-1":
      break;
    case "board_check_in-4":
      spawnNotes("Check-In");
      dispatch(Actions.changePhase("board_data"));
      break;
    case "board-check-in_3":
      break;
    case "board_data-1":
      break;
    case "board_data-2":
      spawnNotes("Mad");
      setTimeout(() => {
        spawnNotes("Sad");
      }, 500);
      setTimeout(() => {
        spawnNotes("Glad");
      }, 700);
      dispatch(Actions.incrementStep());
      break;
    case "board_insights":
      break;
    case "board_actions":
      break;
    case "board_check_out":
      break;
    case "outro":
      break;
    default:
      break;
  }

  return (
    <div className="onboarding-controller-wrapper">
      {phase !== "newBoard" ? (
        <div className="onboarding-controller">
          <button
            className="onboarding-button onboarding-skip-button"
            aria-label="Skip this phase"
            onClick={() => {
              dispatch(Actions.incrementStep(100));
            }}
          >
            {t("Onboarding.skip")}
          </button>

          <button
            className="onboarding-icon-button"
            aria-label="Toggle Onboarding Popup"
            onClick={() => {
              dispatch(Actions.toggleStepOpen());
            }}
          >
            <StanIcon />
          </button>

          <button
            className="onboarding-button onboarding-next-button"
            aria-label="Go to next step"
            onClick={() => {
              dispatch(Actions.incrementStep());
            }}
          >
            {t("Onboarding.next")}
          </button>
        </div>
      ) : (
        <button
          className="onboarding-icon-button onboarding-new_board"
          onClick={() => {
            dispatch(Actions.toggleStepOpen());
          }}
        >
          <StanIcon />
        </button>
      )}

      {/* For some reason, updating the position didn't work with a switch case outside the return but works this way:
          TODO: find reason and refactor this if time is left at the end of development */}
      {phaseStep === "newBoard-1" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.newBoardWelcome")} isExercisePrompt={false} />}
          target=".new-board__mode-selection"
          placement="right"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "newBoard-2" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.newBoardWelcome")} isExercisePrompt={false} />}
          target=".new-board__extended"
          placement="right-end"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "board_check_in-1" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.checkInWelcome")} isExercisePrompt={false} />}
          placement="center"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "board_check_in-2" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.checkAddColumn")} isExercisePrompt />}
          target=".column__header-edit-button-icon"
          placement="right"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "board_check_in-3" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.checkInAddTeam")} isExercisePrompt={false} />}
          target=".share-button"
          placement="bottom-end"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {/* placeholder board_check_in-4 */}
      {phaseStep === "board_data-1" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.dataWelcome")} isExercisePrompt={false} />}
          target=".column + .column"
          placement="left"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "board_data-2" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.dataCardsAdded")} isExercisePrompt={false} />}
          placement="center"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
      {phaseStep === "board_data-3" && (
        <Floater
          open={stepOpen}
          component={<OnboardingBase text={t("Onboarding.dataStacks")} isExercisePrompt={false} />}
          target=".column + .column"
          placement="left"
          styles={{arrow: {length: 14, spread: 22}}}
        />
      )}
    </div>
  );
};
