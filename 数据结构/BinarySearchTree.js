function Stack() {
  this.items = [];
  // 将元素压入栈
  Stack.prototype.push = function(element) {
    this.items.push(element);
  }
  // 弹出栈顶元素
  Stack.prototype.pop = function() {
    return this.items.pop();
  }
  // 返回栈顶元素
  Stack.prototype.peek = function() {
    const lastIndex = this.items.length - 1;
    return this.items[lastIndex];
  }
  // 判断栈是否为空
  Stack.prototype.isEmpty = function() {
    return this.items.length === 0;
  }
  // 获取栈中元素个数
  Stack.prototype.size = function() {
    return this.items.length;
  }
  // toString方法
  Stack.prototype.toString = function() {
    return this.items.join(' ');
  }
}

function BinarySearchTree() {
  this.root = null;
  function Node(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
  BinarySearchTree.prototype.insert = function(key) {
    const newNode = new Node(key);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }
  BinarySearchTree.prototype.insertNode = function(node, newNode) {
    if (node.key > newNode.key) {
      if (node.left === null) node.left = newNode;
      else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) node.right = newNode;
      else {
        this.insertNode(node.right, newNode);
      }
    }
  },
  BinarySearchTree.prototype.search = function(key) {
    let node = this.root;
    while(node) {
      if (node.key > key) {
        node = node.left;
      } else if (node.key < key) {
        node = node.right;
      } else {
        return true;
      }
    }
    return false;
  },
  BinarySearchTree.prototype.preOrderTraverse = function(handler) {
    let stack = new Stack();
    let p = this.root;
    while(!stack.isEmpty() || p) {
      while(p) {
        handler(p.key);
        stack.push(p);
        p = p.left;
      }
      p = stack.pop();
      p = p.right;
    }
  },
  BinarySearchTree.prototype.inOrderTraverse = function(handler) {
    let stack = new Stack();
    let p = this.root;
    while(!stack.isEmpty() || p) {
      while(p) {
        stack.push(p);
        p = p.left;
      }
      p = stack.pop();
      handler(p.key);
      p = p.right;
    }
  },
  // BinarySearchTree.prototype.preOrderTraverse = function(handler) {
  //   let stack = new Stack();
  //   let p = this.root;
  //   while(!stack.isEmpty() || p) {
  //     while(p) {
  //       handler(p.key);
  //       stack.push(p);
  //       p = p.left;
  //     }
  //     p = stack.pop();
  //     p = p.right;
  //   }
  // },
  // BinarySearchTree.prototype.inOrderTraverse = function(handler) {
  //   let stack = new Stack();
  //   let p = this.root;
  //   // console.log(this.root);
  //   while(!stack.isEmpty() || p) {
  //     while(p) {
  //       stack.push(p);
  //       p = p.left;
  //     }
  //     p = stack.pop();
  //     handler(p.key);
  //     p = p.right;
  //   }
  // },
  // BinarySearchTree.prototype.postOrderTraverse = function(handler) {
  //   let stack = new Stack();
  //   let p = this.root;
  //   let visited = null;
  //   while(!stack.isEmpty() || p) {
  //     while(p) {
  //       stack.push(p)
  //       p = p.left;
  //     }
  //     p = stack.pop();
  //     // 颜色标记法，右节点已访问过则不再访问(右节点总是在该节点上一次处理)
  //     if (p.right === null || p.right === visited) {
  //       handler(p.key);
  //       visited = p;
  //       p = null;  // 置空，跳过处理左节点的步骤
  //     } else {
  //       // 处理右节点
  //       stack.push(p);
  //       p = p.right;
  //     }
  //   }
  // },
  BinarySearchTree.prototype.remove = function(key) {
    let current = this.root;
    let parentNode = null;
    let isLeftNode = true;
    if (this.root === null) return false;
    while (current && current.key !== key) {
      parentNode = current;
      if (current.key < key) {
        current = current.right;
        isLeftNode = false;
      } else if (current.key > key) {
        current = current.left;
        isLeftNode = true;
      }
    }
    if (current === null) return false;
    else if (current.left === null && current.right === null) {
      if (current === this.root) this.root = null;
      parentNode[isLeftNode ? 'left' : 'right'] = null;
    } else if (current.right === null) {
      if (current === this.root) this.root = this.root.left;
      parentNode[isLeftNode ? 'left' : 'right'] = current.left;
    } else if (current.left === null) {
      if (current === this.root) this.root = this.root.right;
      parentNode[isLeftNode ? 'left' : 'right'] = current.right;
    } else {
      // 寻找后继节点
      let successor = this.getSuccessor(current);
      if (current === this.root) {
        this.root = successor;
      } else {
        parentNode[isLeftNode ? 'left' : 'right'] = successor;
      }
      successor.left = current.left;
    }
  },
  BinarySearchTree.prototype.getSuccessor = function(delNode) {
    let successor = delNode.right;
    let successorParent = delNode;
    while(successor.left) {
      successorParent = successor;
      successor = successor.left;
    }
    // 判断是否右节点就是后继节点
    if (successorParent !== delNode) {
      successorParent.left = successor.right;
      successor.right = delNode.right;
    }
    return successor;
  }
}

  // const bst = new BinarySearchTree();
  // bst.insert(11);
  // bst.insert(7);
  // bst.insert(15);
  // bst.insert(5);
  // bst.insert(9);
	// console.log(bst);
  // console.log(bst.search(12));
  // console.log(bst.search(15));//测试代码
    //1.创建BinarySearchTree
    let bst = new BinarySearchTree()

    //2.插入数据
    bst.insert(11);
    bst.insert(7);
    bst.insert(15);
    bst.insert(5);
    bst.insert(3);
    bst.insert(9);
    bst.insert(8);
    bst.insert(10);
    bst.insert(13);
    bst.insert(12);
    bst.insert(14);
    bst.insert(20);
    bst.insert(18);
    bst.insert(25);
    bst.insert(6);
    bst.insert(19);
    
  //  3.测试删除代码
    //删除没有子节点的节点
    bst.remove(3)
    bst.remove(8)
    bst.remove(10)

    //删除有一个子节点的节点
    bst.remove(5)
    bst.remove(19)

    //删除有两个子节点的节点
    bst.remove(9)
    bst.remove(7)
    bst.remove(15)

    //遍历二叉搜索树并输出
    let resultString = ""
    bst.postOrderTraverse(function(key){
      resultString += key + "->"
    })
    console.log(resultString);