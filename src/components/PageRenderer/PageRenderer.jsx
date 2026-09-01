import BoxiTalk from "../BoxiTalk/BoxiTalk";
import BoxConveyor from "../BoxConveyor/BoxConveyor";
import DragQuestion from "../DragQuestion/DragQuestion";
import BoxiSteps from "../BoxiSteps/BoxiSteps";
import OptionsQuestion from "../OptionsQuestion/OptionsQuestion";

function PageRenderer({ page, onComplete }) {
  switch (page.type) {
    case "boxiTalk":
      return <BoxiTalk data={page} onComplete={onComplete} />;

    case "boxConveyor":
      return <BoxConveyor data={page} onComplete={onComplete} />;

    case "dragQuestion":
      return <DragQuestion data={page} onComplete={onComplete} />;

    case "boxiSteps":
      return <BoxiSteps data={page} onComplete={onComplete} />;

    case "optionsQuestion":
      return <OptionsQuestion data={page} onComplete={onComplete} />;

    default:
      return null;
  }
}

export default PageRenderer;
