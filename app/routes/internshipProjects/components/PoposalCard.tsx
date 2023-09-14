import { CardActionArea, CardContent, Card, Chip } from "@mui/material";
import EllipsisText from "app/core/components/EllipsisText";
import { ProposalCardWrap } from "../../../core/components/ProposalCard/ProposalCard.styles";
import { useNavigate } from "@remix-run/react";

interface IProps {
  id: string | number;
  title: string;
  date: string;
  description: string;
  skills?: { name: string }[];
  isOwner?: boolean;
}

export const ProposalCard = (props: IProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/internshipProjects/${props.id}`);
  };

  return (
    <>
      <Card>
        <CardActionArea sx={{ height: "100%" }} onClick={handleCardClick}>
          <CardContent>
            <ProposalCardWrap>
              <div className="ProposalCard__head">
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
            </ProposalCardWrap>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
export default ProposalCard;
