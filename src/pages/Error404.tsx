import {MessageOverlay} from "../components/MessageOverlay";
import {Container} from "@mantine/core";
import {useTranslation} from "react-i18next";

function ErrorPage() {
    const { t } = useTranslation();

    return (
        <>
            <Container size="lg">
                <MessageOverlay title={t("error")} message={t("notfound")} link="/" linkTitle={t("retmain")}></MessageOverlay>
            </Container>
        </>
    );
}

export default ErrorPage;
