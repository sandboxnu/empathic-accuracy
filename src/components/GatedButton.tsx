// Button that can only be clicked under some condition and displays a tooltip when disabled

import { OverlayTrigger, Tooltip, ButtonProps, Button } from "react-bootstrap";
import React from "react";

interface GatedButtonProps extends ButtonProps {
  disabled: boolean; // should we disable the button?
  tooltip: string; // tooltip message when disabled
  id?: string;
  children: React.ReactNode;
  onClick: (e: MouseEvent) => void;
}

export default function GatedButton(props: GatedButtonProps) {
  if (props.disabled) {
    return (
      <OverlayTrigger
        placement={"top"}
        overlay={
          <Tooltip id={`tooltip-${props?.id || ""}`}>{props.tooltip}</Tooltip>
        }
      >
        <Button {...props}>{props.children}</Button>
      </OverlayTrigger>
    );
  } else {
    return <Button {...props}>{props.children}</Button>;
  }
}
