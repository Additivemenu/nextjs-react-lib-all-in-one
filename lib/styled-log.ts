type StyledLogOptions = {
  fontColor?: string; // Font color
  backgroundColor?: string; // Background color
  fontSize?: string; // Font size (e.g., '16px', '1.2em')
  fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number; // Font weight
};

function styledLog(message: string, options: StyledLogOptions = {}): void {
  const {
    fontColor = "blue", // Default font color
    backgroundColor = "yellow", // Default background color
    fontSize = "16px", // Default font size
    fontWeight = "normal", // Default font weight
  } = options;

  const style = `
      color: ${fontColor};
      background: ${backgroundColor};
      font-size: ${fontSize};
      font-weight: ${fontWeight};
      padding: 2px 4px; /* Optional for better appearance */
      border-radius: 3px; /* Optional for rounded corners */
    `;

  console.log(`%c${message}`, style);
}

export { styledLog };
