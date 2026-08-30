import React from "react";

import BoxiTalk from "../BoxiTalk/BoxiTalk";

// בהמשך:
// import BoxConveyor from "../BoxConveyor/BoxConveyor";
// import OptionsQuestion from "../OptionsQuestion/OptionsQuestion";
// import DragQuestion from "../DragQuestion/DragQuestion";

function PageRenderer({ page, onComplete }) {
  switch (page.type) {
    case "boxiTalk":
      return (
        <BoxiTalk
          data={page}
          onComplete={onComplete}
        />
      );

    // בהמשך:
    // case "boxConveyor":
    //   return <BoxConveyor data={page} onComplete={onComplete} />;

    // case "optionsQuestion":
    //   return <OptionsQuestion data={page} onComplete={onComplete} />;

    // case "dragQuestion":
    //   return <DragQuestion data={page} onComplete={onComplete} />;

    default:
      return (
        <div>
          לא נמצאה קומפוננטה עבור סוג העמוד: {page.type}
        </div>
      );
  }
}

export default PageRenderer;