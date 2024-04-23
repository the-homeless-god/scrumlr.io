import {RootContainer, FontFamilyProvider} from "@coconut-xr/koestlich";
import {makeBorderMaterial} from "@coconut-xr/xmaterials";
import {RayGrab} from "@react-three/xr";
import {MeshPhongMaterial} from "three";
import {Suspense} from "react";
import {BG_COLOR_DEFAULT} from "components/XR/xr-constants";
import XRBoardHeader from "../XRBoardHeader/XRBoardHeader";
import XRBoard from "../XRBoard/XRBoard";

// TODO: make semi transparent glass material
const GlassMaterial = makeBorderMaterial(MeshPhongMaterial, {
  specular: 0xffffff,
  shininess: 100,
  transparent: true,
});

const XRContainer = () => (
  <RayGrab>
    <Suspense>
      <FontFamilyProvider
        fontFamilies={{
          medium: ["https://coconut-xr.github.io/msdf-fonts/", "inter.json"],
          bold: ["https://coconut-xr.github.io/msdf-fonts/", "inter-bold.json"],
        }}
        defaultFontFamily="medium"
      >
        <RootContainer
          backgroundColor={BG_COLOR_DEFAULT}
          backgroundOpacity={0.8}
          material={GlassMaterial}
          sizeX={2}
          sizeY={1}
          borderRadius={32}
          borderBend={0.3}
          border={4}
          borderColor="#888"
          borderOpacity={0.3}
          flexDirection="column"
          position={[0, -0.2, -1.2]}
        >
          <XRBoardHeader />
          <XRBoard />
        </RootContainer>
      </FontFamilyProvider>
    </Suspense>
  </RayGrab>
);

export default XRContainer;
