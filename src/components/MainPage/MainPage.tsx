import {HeroText} from "./Heropage";
import {FeaturesCards} from "./components/FetureSection";
import {NewsSection} from "./components/NewsSection";

export function MainPage() {

    return (
        <>
            <HeroText/>
            <NewsSection></NewsSection>
            <FeaturesCards></FeaturesCards>
        </>
    );
}
