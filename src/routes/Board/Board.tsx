import {LoadingScreen} from "components/LoadingScreen";
import {BoardComponent} from "components/Board";
import {Column} from "components/Column";
import {Request} from "components/Request";
import store, {useAppSelector} from "store";
import {InfoBar} from "components/Infobar";
import {TabIndex} from "constants/tabIndex";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {Actions} from "store/action";
import _ from "underscore";
import {Outlet} from "react-router-dom";
import {DragDropContext, DragUpdate, DropResult} from "react-beautiful-dnd";
import {useDispatch} from "react-redux";

export const Board = () => {
  const dispatch = useDispatch();
  useEffect(
    () => () => {
      toast.clearWaitingQueue();
      toast.dismiss();
    },
    []
  );

  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      () => {
        store.dispatch(Actions.leaveBoard());
      },
      false
    );

    window.addEventListener(
      "onunload",
      () => {
        store.dispatch(Actions.leaveBoard());
      },
      false
    );
  }, []);

  const state = useAppSelector(
    (applicationState) => ({
      board: {
        id: applicationState.board.data?.id,
        status: applicationState.board.status,
      },
      columns: applicationState.columns,
      requests: applicationState.requests,
      participants: applicationState.participants,
      auth: applicationState.auth,
      view: applicationState.view,
    }),
    _.isEqual
  );

  const currentUserIsModerator = state.participants?.self.role === "OWNER" || state.participants?.self.role === "MODERATOR";

  if (state.board.status === "pending") {
    return <LoadingScreen />;
  }

  const onDragEnd = (result: DropResult) => {
    const {destination, source, combine, draggableId} = result;
    if (combine) {
      dispatch(Actions.editNote(draggableId, {position: {column: combine.droppableId, stack: combine.draggableId, rank: 0}}));
    }
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    dispatch(Actions.editNote(draggableId, {position: {column: destination.droppableId, stack: undefined, rank: destination.index}}));
  };

  const onDragUpdate = (initial: DragUpdate) => {
    const {destination, source, draggableId} = initial;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    dispatch(Actions.editNote(draggableId, {position: {column: destination.droppableId, stack: undefined, rank: destination.index}}));
  };

  if (state.board.status === "ready") {
    return (
      <>
        {currentUserIsModerator && (
          <Request
            requests={state.requests.filter((request) => request.status === "PENDING")}
            participantsWithRaisedHand={state.participants!.others.filter((p) => p.raisedHand)}
          />
        )}
        <InfoBar />
        <Outlet />
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
          <BoardComponent currentUserIsModerator={currentUserIsModerator} moderating={state.view.moderating}>
            {state.columns
              .filter((column) => column.visible || (currentUserIsModerator && state.participants?.self.showHiddenColumns))
              .map((column, columnIndex) => (
                <Column
                  tabIndex={TabIndex.Column + columnIndex * 17}
                  key={column.id}
                  id={column.id}
                  index={column.index}
                  name={column.name}
                  visible={column.visible}
                  color={column.color}
                />
              ))}
          </BoardComponent>
        </DragDropContext>
      </>
    );
  }
  return <LoadingScreen />;
};
