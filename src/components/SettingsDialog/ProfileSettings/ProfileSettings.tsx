import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {useContext, useState} from "react";
import store, {useAppSelector} from "store";
import {Actions} from "store/action";
import {useDispatch} from "react-redux";
import {ReactComponent as InfoIcon} from "assets/icon-info.svg";
import {Toggle} from "components/Toggle";
import {AvatarSettings} from "../Components/AvatarSettings";
import {SettingsInput} from "../Components/SettingsInput";
import {SettingsButton} from "../Components/SettingsButton";
import {Footer} from "../Components/Footer";
import {SettingsContext} from "../SettingsContext";
import "./ProfileSettings.scss";

export const ProfileSettings = () => {
  const {settings} = useContext(SettingsContext);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const state = useAppSelector((applicationState) => ({
    participant: applicationState.participants!.self,
    hotkeysAreActive: applicationState.view.hotkeysAreActive,
  }));
  const [userName, setUserName] = useState<string>(state.participant?.user.name);
  const [id] = useState<string | undefined>(state.participant?.user.id);
  const [saved, setSaved] = useState<boolean>(false);
  const [canceled, setCanceled] = useState<boolean>(false);

  return (
    <div className={classNames("settings-dialog__container", "accent-color__lean-lilac")}>
      <header className="settings-dialog__header">
        <h2 className="settings-dialog__header-text">{t("ProfileSettings.Profile")}</h2>
      </header>
      <div className="profile-settings__container-wrapper">
        <div className="profile-settings__container">
          <SettingsInput
            id="profileSettingsUserName"
            label={t("ProfileSettings.UserName")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            submit={() => store.dispatch(Actions.editSelf({...state.participant.user, name: userName}))}
          />

          <AvatarSettings id={id} saved={saved} setSaved={setSaved} canceled={canceled} setCanceled={setCanceled} />
          <div className="profile-settings__hotkey-settings">
            <SettingsButton
              className="profile-settings__toggle-hotkeys-button"
              label={t("Hotkeys.hotkeyToggle")}
              onClick={() => {
                dispatch(Actions.setHotkeyState(!state.hotkeysAreActive));
              }}
            >
              <Toggle active={state.hotkeysAreActive} />
            </SettingsButton>
            <a className="profile-settings__open-cheat-sheet-button" href={`${process.env.PUBLIC_URL}/hotkeys.pdf`} target="_blank" rel="noopener noreferrer">
              <p>{t("Hotkeys.cheatSheet")}</p>
              <InfoIcon />
            </a>
          </div>
        </div>
      </div>
      {settings?.profile?.unsavedAvatarChanges && (
        <Footer className="profile-settings__footer">
          <button onClick={() => setSaved(true)}>{t("ProfileSettings.SaveAvatar")}</button>
          <button onClick={() => setCanceled(true)}>{t("ProfileSettings.Cancel")}</button>
        </Footer>
      )}
    </div>
  );
};
