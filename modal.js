const option = (label, value) => {
  return {
    text: {
      type: "plain_text",
      text: label,
      emoji: true
    },
    value: String(value)
  };
};

const optionArray = options => {
  const array = [];
  options.map(op => {
    const element = option(op[0], op[1]);
    array.push(element);
  });
  return array;
};

const blocks = options => {
  return [
    {
      type: "input",
      label: {
        type: "plain_text",
        text: "来月の稼働予定",
        emoji: true
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "稼働予定を入力",
          emoji: true
        },
        options: optionArray(options),
        action_id: "select"
      },
      block_id: "input_1"
    },
    {
      type: "input",
      label: {
        type: "plain_text",
        text: "再来月の稼働予定",
        emoji: true
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "稼働予定を入力",
          emoji: true
        },
        options: optionArray(options),
        action_id: "select"
      },
      block_id: "input_2"
    }
  ];
};

const modal = options => {
  return {
    type: "modal",
    callback_id: "view_modal",
    title: {
      type: "plain_text",
      text: "稼働予定入力"
    },
    blocks: blocks(options),
    submit: {
      type: "plain_text",
      text: "送信する"
    },
    close: {
      type: "plain_text",
      text: "キャンセル"
    }
  };
};

exports.modal = modal;
