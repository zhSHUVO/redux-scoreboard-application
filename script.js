// select dom element
const allMatches = document.querySelector(".all-matches");
const addMatchEl = document.querySelector(".lws-addMatch");
const resetEl = document.querySelector(".lws-reset");

// action identifires
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADDMATCH = "addMatch";
const RESET = "reset";

// action creators
const increment = (matchID, value) => {
    return {
        type: INCREMENT,
        payload: {
            id: parseInt(matchID),
            value: parseInt(value),
        },
    };
};

const decrement = (matchID, value) => {
    return {
        type: DECREMENT,
        payload: {
            id: parseInt(matchID),
            value: parseInt(value),
        },
    };
};

const addMatch = () => {
    return {
        type: ADDMATCH,
    };
};

const reset = () => {
    return {
        type: RESET,
    };
};

// initial state
const initialState = {
    1: 0,
    targeted: 1,
};

// reducer function
function scoreboardReducer(state = initialState, action) {
    if (action.type === INCREMENT) {
        return {
            ...state,
            [action.payload.id]:
                state[action.payload.id] + action.payload.value,
            targeted: action.payload.id,
        };
    } else if (action.type === DECREMENT) {
        return {
            ...state,
            [action.payload.id]:
                state[action.payload.id] - action.payload.value > 0
                    ? state[action.payload.id] - action.payload.value
                    : 0,
            targeted: action.payload.id,
        };
    } else if (action.type === ADDMATCH) {
        const node = document.querySelector(".match");
        const clone = node.cloneNode(true);

        let nextMatchID = Object.keys(state).length;

        document
            .querySelector(".all-matches")
            .appendChild(clone)
            .setAttribute("id", nextMatchID);
        document
            .getElementById(nextMatchID)
            .querySelector(".wrapper")
            .querySelector(".lws-matchName").innerText = `Match ${nextMatchID}`;

        return {
            ...state,
            [nextMatchID]: 0,
            targeted: nextMatchID,
        };
    } else if (action.type === RESET) {
        const resetState = {
            ...state,
        };

        Object.keys(resetState).forEach((key) => {
            resetState[key] = 0;
        });

        return resetState;
    } else {
        return state;
    }
}

// redux store
const store = Redux.createStore(scoreboardReducer);

// render
const render = () => {
    const state = store.getState();
    console.log(state);

    if (state.targeted) {
        document
            .getElementById(`${state.targeted}`)
            .querySelector(".numbers")
            .querySelector(".lws-singleResult").innerText =
            state[state.targeted];
    } else {
        document
            .querySelectorAll(".lws-singleResult")
            .forEach(function (element) {
                element.innerText = 0;
            });
    }
};

render();

store.subscribe(render);

// event listener
allMatches.addEventListener("keypress", (event) => {
    if (event.code === "Enter") {
        event.preventDefault();

        if (event.target.id === "increment") {
            const matchID = event.target.parentNode.parentNode.parentNode.id;
            const value = event.target.value;
            store.dispatch(increment(matchID, value));
        } else if (event.target.id === "decrement") {
            const matchID = event.target.parentNode.parentNode.parentNode.id;
            const value = event.target.value;
            store.dispatch(decrement(matchID, value));
        }

        event.target.value = "";
    }
});

addMatchEl.addEventListener("click", () => {
    store.dispatch(addMatch());
});

resetEl.addEventListener("click", () => {
    store.dispatch(reset());
});
