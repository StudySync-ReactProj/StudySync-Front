import {
  ContainerWrapper,
  FormCard,
  Title,
  Subtitle,
} from "./FormContainer.style";

const FormContainer = ({ title, subtitle, children }) => {
  return (
    <ContainerWrapper>
      <FormCard elevation={4}>
        {title && <Title variant="h2">{title}</Title>}
        {subtitle && <Subtitle variant="h6">{subtitle}</Subtitle>}
        {children}
      </FormCard>
    </ContainerWrapper>
  );
};

export default FormContainer;
