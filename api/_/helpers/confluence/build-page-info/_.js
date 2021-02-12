import { format } from 'date-fns';
import wrapHTML from './../wrap-html';

const {
  MEMBERS,
  SQUAD_NAME,
} = process.env;

const membersByEmail = MEMBERS.split(',')
  .reduce((acc, m) => {
    const [id, emailName] = m.split('#');
    return { ...acc, [emailName]: id };
  }, {});

const buildParticipants = (participants, { wrapBy = '' } = {}) => (
  participants.map(emailName => (`
    ${wrapHTML(
      membersByEmail[emailName]
        ? `<ac:link><ri:user ri:account-id="${membersByEmail[emailName]}" /></ac:link>`
        : emailName,
      wrapBy)}
  `)).join('\n')
);

export default ({ participants = Object.keys(membersByEmail), date }) => `
  <ac:structured-macro ac:name="expand" ac:schema-version="1" data-layout="full-width">
    <ac:parameter ac:name="title">Page Information</ac:parameter>
    <ac:rich-text-body>
      <p><strong>Date</strong> </p>
      <ul>
         <li>
            <p><time datetime="${format(new Date(date), 'yyyy-MM-dd')}" /> </p>
         </li>
      </ul>
      <p><strong>Team </strong></p>
      <ul>
         <li>
            <p>${SQUAD_NAME}</p>
         </li>
      </ul>
      <p><strong>Participants</strong></p>
      <ul>
        ${buildParticipants(participants, { wrapBy: '<li><p>' })}
      </ul>
      <p />
    </ac:rich-text-body>
  </ac:structured-macro>
`;
