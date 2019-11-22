const { App } = require("@slack/bolt");
const axios = require("axios");
const { modal } = require("./modal");
const { RAILS_SERVER, API, SIGNING_SECRET, TOKEN } = require("./constrants");

const app = new App({
  signingSecret: SIGNING_SECRET,
  token: TOKEN
});

app.event("team_join", ({ event, say }) => {
  say(
    `<@${event.user}>さん、はじめまして。こちらのbotから登録をお願い致します。`
  );
});

const gbbsCommand = ({ ack, body, say, payload, context }) => {
  ack();
  switch (body.text) {
    case "input":
      input({ payload, context, say });
      break;
    case "list":
      list({ payload, say });
      break;
    case "id":
      const message = payload.user_id ? payload.user_id : unregisteredMessage;
      say(message);
      break;
    case "help":
    default:
      help({ say });
  }
};

const modalSwitch = (kind, { payload, context, say }) => {
  const id = payload.user_id;
  const kindApi = `${API}/user?slack_id=${id}`;
  axios.get(kindApi).then(res => {
    const { kind } = res.data.data;
    if (kind) {
      const optionApi = `${API}/schedule_information/options?slack_id=${id}`;
      axios.get(optionApi).then(res => {
        const { options } = res.data.data;
        const view = modal(options);
        openModal({ payload, context }, view);
      });
    } else {
      say(unregisteredMessage);
    }
  });
};

const openModal = ({ payload, context }, view) => {
  try {
    const result = app.client.views.open({
      token: context.botToken,
      trigger_id: payload.trigger_id,
      view: view
    });
  } catch {
    err => console.log(err);
  }
};

const unregisteredMessage = `登録が未完了です。登録を完了してください。 ${RAILS_SERVER}`;

const input = ({ payload, context, say }) => {
  const userApi = `${API}/user`;
  modalSwitch(payload.user_id, { payload, context, say });
};

const list = ({ payload, say }) => {
  const id = payload.user_id;
  const scheduleApi = `${API}/schedule_information?slack_id=${id}`;
  axios.get(scheduleApi).then(res => {
    const { schedules } = res.data.data;
    const message = () => {
      if (schedules[0] && schedules[1]) {
        return `来月の稼働予定は *${schedules[0]}* , 再来月の稼働予定は *${
          schedules[1]
        }* です。`;
      } else if (schedules[0]) {
        return `来月の稼働予定は *${schedules[0]}* です。`;
      } else {
        return unregisteredMessage;
      }
    };
    say(message());
  });
};

const help = ({ say }) => {
  say("/gbbs input コマンドで予定の入力、/gbbs list で予定の確認ができます");
};

app.command("/gbbs", gbbsCommand);

const modalSubmit = ({ body, view, say }) => {
  const { id } = body.user;
  const { input_1, input_2 } = view.state.values;
  const value1 = Number(input_1.select.selected_option.value);
  const value2 = Number(input_2.select.selected_option.value);
  const values = [value1, value2];
  const postData = {
    schedule_informations: {
      schedules: values
    }
  };
  const scheduleApi = `${API}/schedule_information?slack_id=${id}`;
  axios.patch(scheduleApi, postData).catch(err => console.log(err));
  //say(`来月の稼働を${values[0]}、再来月の稼働を${values[1]}で登録しました。`);
};

app.view("view_modal", ({ ack, body, view, say }) => {
  ack();
  modalSubmit({ body, view, say });
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
