import React, { useState } from 'react';
import { Popover } from 'antd';
import ActionButton from '@/ActionButton';
import AddIcon from '../icons/add-button.svg';
import AddNormalIcon from '../icons/add-normal.svg';
import AddBranchIcon from '../icons/add-branch.svg';
import {
  getRegisterNode,
  getIsStartNode,
  getIsEndNode,
  getIsBranchNode,
  getIsConditionNode,
} from '@/utils';

import { INode, IRegisterNode } from '@/index';

interface IProps {
  registerNodes: IRegisterNode[];
  node: INode;
  nodes: INode[];
  onAddNode: (node: INode, newNodeType: string) => void;
}

const AddNodeButton: React.FC<IProps> = (props) => {
  const { registerNodes, node, nodes, onAddNode } = props;

  const [visible, setVisible] = useState(false);

  const registerNode = getRegisterNode(registerNodes, node.type);
  const AddableComponent = registerNode?.addableComponent;
  const addableNodeTypes = registerNode?.addableNodeTypes;

  const options = registerNodes.filter(
    (item) =>
      !getIsStartNode(registerNodes, item.type) &&
      !getIsEndNode(registerNodes, item.type) &&
      !getIsConditionNode(registerNodes, item.type) &&
      (Array.isArray(addableNodeTypes)
        ? addableNodeTypes.includes(item.type)
        : true),
  );

  const handleAddNode = (newNodeType: string) => {
    onAddNode(node, newNodeType);
    setVisible(false);
  };

  const addableOptions = AddableComponent ? (
    <AddableComponent node={node} nodes={nodes} add={handleAddNode} />
  ) : (
    <>
      {options.map((item) => {
        const registerNode = getRegisterNode(registerNodes, item.type);
        const defaultIcon = getIsBranchNode(registerNodes, item.type)
          ? AddBranchIcon
          : AddNormalIcon;
        return (
          <div
            className="flow-builder-addable-node-item"
            key={item.type}
            onClick={() => handleAddNode(item.type)}
          >
            <span className="flow-builder-addable-node-icon">
              {registerNode?.addIcon || <img src={defaultIcon} />}
            </span>

            <span>{item.name}</span>
          </div>
        );
      })}
    </>
  );

  return options.length > 0 ? (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="flow-builder-addable-nodes"
      placement="rightTop"
      trigger={['click']}
      content={addableOptions}
      getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {!!registerNode?.actionButton ? (
          registerNode?.actionButton
        ) : (
          <ActionButton icon={AddIcon} />
        )}
      </div>
    </Popover>
  ) : null;
};

export default AddNodeButton;
