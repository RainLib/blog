/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link, { type Props as LinkProps } from "@docusaurus/Link";
import AuthorSocials from "@theme/Blog/Components/Author/Socials";
import type { Props } from "@theme/Blog/Components/Author";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { motion } from "framer-motion";

function MaybeLink(props: LinkProps): ReactNode {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

function AuthorTitle({ title }: { title: string }) {
  return (
    <small className={styles.authorTitle} title={title}>
      {title}
    </small>
  );
}

function AuthorName({ name, as }: { name: string; as: Props["as"] }) {
  if (!as) {
    return (
      <span className={styles.authorName} translate="no">
        {name}
      </span>
    );
  } else {
    return (
      <Heading as={as} className={styles.authorName} translate="no">
        {name}
      </Heading>
    );
  }
}

function AuthorBlogPostCount({ count }: { count: number }) {
  return <span className={clsx(styles.authorBlogPostCount)}>{count}</span>;
}

export default function BlogAuthor({
  as,
  author,
  className,
  count,
}: Props): ReactNode {
  const { name, title, url, imageURL, email, page } = author;
  const link =
    page?.permalink || url || (email && `mailto:${email}`) || undefined;

  return (
    <div
      className={clsx(
        "avatar margin-bottom--sm",
        className,
        styles[`author-as-${as}`],
      )}
    >
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <motion.img
            whileHover={{ scale: 1.05 }}
            className={clsx("avatar__photo", styles.authorImage)}
            src={imageURL}
            alt={name}
          />
        </MaybeLink>
      )}

      {(name || title) && (
        <div className={clsx("avatar__intro", styles.authorDetails)}>
          <div className="avatar__name">
            {name && (
              <MaybeLink href={link}>
                <AuthorName name={name} as={as} />
              </MaybeLink>
            )}
            {count !== undefined && <AuthorBlogPostCount count={count} />}
          </div>
          {!!title && <AuthorTitle title={title} />}
          <AuthorSocials author={author} />
        </div>
      )}
    </div>
  );
}
