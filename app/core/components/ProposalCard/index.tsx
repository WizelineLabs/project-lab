import { CardActionArea, CardContent, Card, Chip } from "@mui/material";
import EllipsisText from "app/core/components/EllipsisText";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";

import { ProposalCardWrap } from "./ProposalCard.styles";

interface IProps {
  id: string | number;
  title: string;
  picture: string;
  initials: string;
  date: string;
  description: string;
  status: string;
  color: any;
  votesCount?: number | null;
  skills?: { name: string }[];
  isOwner?: boolean;
  tierName: String;
  projectMembers?: number | null;
}

export const ProposalCard = (props: IProps) => {
  const stopEvent = (event: React.MouseEvent<HTMLElement>) =>
    event.stopPropagation();
  return (
    <>
      <Card>
        <CardActionArea
          style={{ height: "100%" }}
          href={`/projects/${props.id}`}
        >
          <CardContent>
            <ProposalCardWrap>
              <div className="ProposalCard__head">
                <div className="ProposalCard__head__icon">
                  {props.picture ? (
                    <img
                      src={props.picture}
                      width="60"
                      height="60"
                      alt="Project"
                    />
                  ) : (
                    <span>{props.initials}</span>
                  )}
                </div>
                <div className="ProposalCard__head__description">
                  <div className="ProposalCard__head__description--title">
                    {props.title}
                  </div>
                  <div className="ProposalCard__head__description--date">
                    {props.date}
                  </div>
                  <div className="ProposalCard__head__description--isOwner">
                    {props.isOwner && <p>Owner</p>}
                  </div>
                </div>
              </div>
              <EllipsisText text={props.description || ""} length={200} />
              <div className="ProposalCard__skills">
                {props.skills &&
                  props.skills[0].name != "" &&
                  props.skills.map((skill) => (
                    <Chip
                      key={skill.name}
                      label={skill.name}
                      sx={{ marginRight: 1, marginBottom: 1 }}
                    />
                  ))}
              </div>
              <div className="ProposalCard__status">
                <hr />

                <div>
                  <div>
                    <span className="ProposalCard__status--display">
                      {props.status}
                    </span>
                    <div className="ProposalCard__tier">
                      <a
                        href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                        target="_blank"
                        rel="noreferrer"
                        onClick={stopEvent}
                      >
                        <label className="ProposalCard__head__description--tier">
                          {props.tierName}
                        </label>
                      </a>
                      <label
                        className="ProposalCard__head__description--tier--extra"
                        title="Maturation framework for innovation projects"
                      >
                        <HelpIcon sx={{ fontSize: 15 }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="ProposalCard__status--like">
                      <span>{props.votesCount} </span>
                      <span>
                        <ThumbUpIcon sx={{ color: "#AF2E33", fontSize: 15 }} />
                      </span>
                    </div>
                    <div className="ProposalCard__status--members">
                      <span>{props.projectMembers} </span>
                      <span>
                        <PersonIcon sx={{ color: "#000000", fontSize: 15 }} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ProposalCardWrap>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
export default ProposalCard;
